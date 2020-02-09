let table;
let tbody;
let selectAllCheckbox;
let averageContainer;
let passingGrade = 65;
let students = [
  {
      "name": "Puckett Reed",
      "grade": "10.32"
    },
    {
      "name": "Hodges Hebert",
      "grade": "13.55"
    },
    {
      "name": "Sexton Sparks",
      "grade": "56.72"
    },
    {
      "name": "Roxie Hubbard",
      "grade": "9.29"
    },
    {
      "name": "Millie Olson",
      "grade": "93.79"
    },
    {
      "name": "Roberts Wooten",
      "grade": "10.17"
    },
    {
      "name": "Ortega Frazier",
      "grade": "84.66"
    },
    {
      "name": "Tammi Mooney",
      "grade": "78.8"
    },
    {
      "name": "Mabel Macias",
      "grade": "46.04"
    },
    {
      "name": "Mariana Hanson",
      "grade": "84.05"
    },
    {
      "name": "Keller Roberson",
      "grade": "92.3"
    },
    {
      "name": "Medina Mercado",
      "grade": "38.97"
    }
];

const validators = [
  function(data) {
    if(data.name.indexOf(' ') > -1) return true;
    return {
      field: 'name',
      message: 'Name needs to have first and last names'
    };
  },
  function(data) {
    const grade = parseFloat(data.grade);
    if(grade < 0 || grade > 100) {
      return {
        field: 'grade',
        message: 'Grade needs to be between 0 and 100'
      }
    }

    return true;
  }
]

function addRow(student) {
  tbody.append(studentRowTemplate(student));
}

function studentRowTemplate(student) {
  const gradeClass = (parseFloat(student.grade) > passingGrade) ? 'grade-pass' : 'grade-fail';
  return `<tr>
      <td class="checkbox-col"><input class="form-control row-checkbox" type="checkbox" /></td>
      <td class="name-col"><span class="editable" data-field="name">${student.name}</span></td>
      <td class="grade-col ${gradeClass}"><span class="editable" data-field="grade">${student.grade}</span></td>
      <td class="options-col"><i class="fas fa-minus-circle delete-row-btn"></i></td>
    </tr>`;
}

function calculateAverage() {
  let total = 0;
  for(let i = 0; i < students.length; i++) {
    total += parseFloat(students[i].grade);
  }
  if(total === 0) return 0;
  return (total / students.length).toFixed(2);
}

function addStudent(student) {
  students.push(student);
  addRow(student);
  averageContainer.text(calculateAverage());
}

function renderStudentTable() {
  tbody.html('');
  for(let i = 0; i < students.length; i++) {
    addRow(students[i]);
  }

  renderAverage();
}

function renderAverage() {
  averageContainer.text(calculateAverage());
}

function checkRowSelectedStatus() {
  const inputs = tbody.find('.row-checkbox');
  let checkState = true;

  if(students.length > 0) {
    for(let i = 0; i < inputs.length; i++) {
      if(!inputs[i].checked) {
        checkState = false;
        break;
      }
    }
  } else {
    checkState = false;
  }

  selectAllCheckbox[0].checked = checkState;
}

function getStudentRow(element) {
  const row = $(element).closest('tr');
  const studentIndex = row.index();

  return {
    row: row,
    studentIndex: studentIndex
  }
}

$(function() {
  const nameField = $('#name-field');
  const gradeField = $('#grade-field');
  table = $('#gradeTable');
  tbody = table.find('tbody');
  averageContainer = $('#average');
  selectAllCheckbox = $('#select-all');

  $('th.sortable').on('click', function() {
    const row = $(this).parent();
    const field = $(this).attr('data-field');
    let dir = ($(this).attr('data-dir'));
    if(dir === undefined) {
      dir = 1;
    } else {
      dir = parseInt(dir) * -1;
    }

    students.sort(function(a, b) {
      let aValue, bValue;
      switch(field) {
        case 'name':
          aValue = a.name.toUpperCase();
          bValue = b.name.toUpperCase();
          if(aValue > bValue) return 1 * dir;
          if(aValue < bValue) return -1 * dir;
          return 0;
          break;
        case 'grade':
          aValue = parseFloat(a.grade);
          bValue = parseFloat(b.grade);
          return dir * (aValue - bValue);
      }
    });

    renderStudentTable();
    row.find('.sort-arrow').html('');
    const icon = dir === 1 ? '<i class="fas fa-long-arrow-alt-down"></i>' :  '<i class="fas fa-long-arrow-alt-up"></i>';
    $(this).find('.sort-arrow').html(icon);
    $(this).attr('data-dir', dir);
  })

  tbody.on('change', '.row-checkbox', function() {
    checkRowSelectedStatus();
  });

  tbody.on('click', '.editable', function() {
    const {row, studentIndex} = getStudentRow(this);
    const student = students[studentIndex];
    const field = $(this).attr('data-field');

    const inputType = field === 'name' ? 'text' : 'number';
    const newInput = $(`<input type="${inputType}" id="editable-input" class="form-control" value="${student[field]}" />`);

    const generateSpan = function(data) {
      return `<span class="editable" data-field="${field}">${data}</span>`
    }

    const td = $(this).parent();

    td.html(newInput);
    newInput.trigger('focus');
    newInput
      .on('blur', function() {
        newInput.remove();
        student[field] = newInput.val().trim();
        students[studentIndex] = student;
        if(field === 'grade') {
          td.removeClass('grade-pass').removeClass('grade-fail');
          const gradeClass = student.grade > passingGrade ? 'grade-pass' : 'grade-fail';
          td.addClass(gradeClass);
          renderAverage();
        }
        td.html(generateSpan(student[field]));
      })
      .on('keydown', function(event) {
        switch(event.keyCode) {
          case 13: // enter
            newInput.trigger('blur');
            break;
          case 27: // esc
            newInput.remove();
            td.html(generateSpan(student[field]));
            break;
        }
      })
  });

  tbody.on('click', '.delete-row-btn', function() {
    const row = $(this).closest('tr');
    const studentIndex = row.index();

    students.splice(studentIndex, 1);
    row.remove();
    renderAverage();
    checkRowSelectedStatus();
  });

  table.on('click', 'tbody tr', function(e) {
    if(!$(e.target).hasClass('row-checkbox')
       && !$(e.target).hasClass('editable')
       && !$(e.target).hasClass('form-control')
      ) {
      const checkbox = $(this).find('.row-checkbox');
      checkbox.prop('checked', !checkbox.prop('checked'));
      checkbox.trigger('change');
    }
  });

  students.forEach(function(student) {
    addRow(student);
    renderAverage();
  });

  $('#studentForm').on('submit', function(event) {
    event.preventDefault();
    nameField.removeClass('is-invalid');
    gradeField.removeClass('is-invalid');

    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name').trim(),
      grade: parseFloat(formData.get('grade'))
    }

    const errors = [];
    for(let i = 0; i < validators.length; i++) {
      const result = validators[i](data);
      if(result !== true) {
        console.error(result.message);
        if(result.field === 'name') {
          nameField.addClass('is-invalid');
        } else {
          gradeField.addClass('is-invalid');
        }
        errors.push(result);
      }
    }

    if(errors.length > 0) {
      return;
    }

    addStudent(data);

    event.target.reset();
  });

  selectAllCheckbox.on('click', function(e) {
    tbody.find('.row-checkbox').prop('checked', this.checked);
  });

  $('#delete-all-checked-btn').on('click', function() {
    let selectedIndices = [];

    tbody.find('.row-checkbox:checked').each(function() {
      selectedIndices.push($(this).closest('tr').index());
    });

    for(let i = selectedIndices.length - 1; i >= 0; i--) {
      students.splice(selectedIndices[i], 1);
    }

    renderStudentTable();
    checkRowSelectedStatus();
  });
});