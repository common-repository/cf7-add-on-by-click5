let form_data = []
let crm_fields = []
let const_values = []
let validate_fields = {
  removed: [],
  new: [],
  modified: []
}
let static_notifications = []

function click5_cf7_addon_notification(type, msg, timeout = 3500) {
let curElement = document.getElementById('click5_cf7_addon_notification');
if (curElement) {
  curElement.remove();
  setTimeout(() => {
    let notificationElement = document.createElement('div');
    notificationElement.setAttribute('id', 'click5_cf7_addon_notification');
    notificationElement.className = type;
    notificationElement.innerHTML = '<span>' + msg + '</span>';

    document.querySelector('body').appendChild(notificationElement);
    notificationElement.style.opacity = '1';
    setTimeout(() => {
      notificationElement.opacity = '0';
      setTimeout(() => {
        notificationElement.remove();
      }, 300);
    }, timeout);
  }, 500);
} else {
  let notificationElement = document.createElement('div');
  notificationElement.setAttribute('id', 'click5_cf7_addon_notification');
  notificationElement.className = type;
  notificationElement.innerHTML = '<span>' + msg + '</span>';

  document.querySelector('body').appendChild(notificationElement);
  notificationElement.style.opacity = '1';
  setTimeout(() => {
    notificationElement.opacity = '0';
    setTimeout(() => {
      notificationElement.remove();
    }, 300);
  }, timeout);
}
}
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function resetAllOptions($) {
  const token = $('#verification_token').val();
  const user = $('#user_identificator').val();
  $.ajax({
    type: 'POST',
    url: '/wp-json/click5_cf7_addon/API/reset_options_AJAX',
    headers: {
        "token": token,
        "user": user
    },
    data: {}
  }).done(function(data) {
    //click5_cf7_addon_notification('success', 'Settings saved.');
  });
}

function updateOption($, type, name, value, callback = undefined) {
  const token = $('#verification_token').val();
  const user = $('#user_identificator').val();

  $.ajax({
    type: 'POST',
    url: '/wp-json/click5_cf7_addon/API/update_option_AJAX',
    headers: {
        "token": token,
        "user": user
    },
    data: {
      type: type,
      option_name: name,
      option_value: value
    }
  }).done(function(data) {
    if (data == true) {
      //click5_cf7_addon_notification('success', 'Settings saved.');
    } else {
      click5_cf7_addon_notification('error', 'Couldn\'t update setting.');
    }
    if (callback !== undefined) {
      callback();
    }
  });
}

function initSelects($) {
  $('select.map_to:not(.not-ajaxable)').each((index, select) => {
    let newInnerHTML = '';
    if (crm_fields.length) {
      let countNotUndefined = 0;
      crm_fields.forEach(field => {
        if (field.parameter !== '_undefined_') {
          countNotUndefined++;
        }
      });
      if (countNotUndefined > 0) {
        newInnerHTML += `<option value="_undefined_">--- Select an Option ---</option>`;
      }
    }
    crm_fields.forEach(field => {
      newInnerHTML += `<option value="${field.parameter}">${field.label}${field.required ? '*' : ''}</option>`;
    });
    select.innerHTML = newInnerHTML;
  });


  $('select.map_to.not-ajaxable').each((index, select) => {
    let newInnerHTML = '';
    if (crm_fields.length) {
      let countNotUndefined = 0;
      crm_fields.forEach(field => {
        if (field.parameter !== '_undefined_') {
          countNotUndefined++;
        }
      });
      if (countNotUndefined > 0) {
        newInnerHTML += `<option value="_undefined_">--- Select an Option ---</option>`;
      }
    }
    crm_fields.forEach(field => {

      var available_options = new Array();
      var my_obj = field.custom_options;
      $.each(my_obj, function (i, z) {
        if(my_obj[i].value.length > 0){
          available_options.push(my_obj[i].value);
        }
      });

      newInnerHTML += `<option value="${field.parameter}" data-type="${field.custom_type}" data-available-options="${available_options}">${field.label}${field.required ? '*' : ''}</option>`;
    });
    select.innerHTML = newInnerHTML;
  });
  
}
function reinitSelects($) {
  $('select.map_to:not(.not-ajaxable)').each((index, select) => {
    let selectedIndex = select.selectedIndex;
    let oldValue = select.options[select.selectedIndex].value;
    let newInnerHTML = '';
    if (crm_fields.length) {
      let countNotUndefined = 0;
      crm_fields.forEach(field => {
        if (field.parameter !== '_undefined_') {
          countNotUndefined++;
        }
      });
      if (countNotUndefined > 0) {
        newInnerHTML += `<option value="_undefined_">--- Select an Option ---</option>`;
      }
    }
    crm_fields.forEach(field => {
      newInnerHTML += `<option value="${field.parameter}"${oldValue == field.parameter ? ' selected':''}>${field.label}${field.required ? '*' : ''}</option>`;
    });
    select.innerHTML = newInnerHTML;
  });

  $('select.map_to.not-ajaxable').each((index, select) => {
    let selectedIndex = select.selectedIndex;
    let oldValue = select.options[select.selectedIndex].value;
    let newInnerHTML = '';
    if (crm_fields.length) {
      let countNotUndefined = 0;
      crm_fields.forEach(field => {
        if (field.parameter !== '_undefined_') {
          countNotUndefined++;
        }
      });
      if (countNotUndefined > 0) {
        newInnerHTML += `<option value="_undefined_">--- Select an Option ---</option>`;
      }
    }
    crm_fields.forEach(field => {

      var available_options = new Array();
      var my_obj = field.custom_options;
      $.each(my_obj, function (i, z) {
        if(my_obj[i].value.length > 0){
          available_options.push(my_obj[i].value);
        }
      });

      newInnerHTML += `<option value="${field.parameter}" data-type="${field.custom_type}" data-available-options="${available_options}"${oldValue == field.parameter ? ' selected':''}>${field.label}${field.required ? '*' : ''}</option>`;

    });
    select.innerHTML = newInnerHTML;
  });

}
function saveSelects($) {
  document.querySelectorAll('select.map_to:not(.not-ajaxable)').forEach(select => {
    const data = {
      type: 'text',
      name: $(select).attr('name'),
      val: $(select).val()
    };
    handleSelectMap(select);
    //tryEnableFormIfNotEnabled($, $(select).attr('data-value'));
    let checkBoxEl = select.parentElement.parentElement.parentElement.querySelector('.enable > input[type="checkbox"]');
    if (checkBoxEl) {
      checkBoxEl.checked = true;
      updateOption($, data.type, data.name, data.val, () => {
          const dataCb = {
            type: 'bool',
            name: $(checkBoxEl).attr('name'),
            val: checkBoxEl.checked ? '1' : '0'
          };
          updateOption($, dataCb.type, dataCb.name, dataCb.val);
      });
    } else {
      updateOption($, data.type, data.name, data.val);
    }
  })
}


function disableCheckboxes($) {
  document.querySelectorAll('.can-disable').forEach(can_disable => {
    can_disable.classList.add('disabled');
  });

  document.querySelectorAll('.tick > input[type="checkbox"]').forEach(tick_checkbox => {
    tick_checkbox.checked = false;
  });

  document.querySelectorAll('input[type="checkbox"].can-disable').forEach(checkBoxEl => {
    checkBoxEl.checked = false;
    checkBoxEl.disabled = true;
    const dataCb = {
      type: 'bool',
      name: $(checkBoxEl).attr('name'),
      val: checkBoxEl.checked ? '1' : '0'
    };
    updateOption($, dataCb.type, dataCb.name, dataCb.val);
  });
}

function enableCheckboxes($) {
  document.querySelectorAll('.can-disable').forEach(can_disable => {
    can_disable.classList.remove('disabled');
  });

  document.querySelectorAll('input[type="checkbox"].can-disable').forEach(checkBoxEl => {
    checkBoxEl.checked = false;
    checkBoxEl.disabled = false;
    const dataCb = {
      type: 'bool',
      name: $(checkBoxEl).attr('name'),
      val: checkBoxEl.checked ? '1' : '0'
    };
    updateOption($, dataCb.type, dataCb.name, dataCb.val);
  });
}


function getRequestCRM($, el) {
  crm_fields = []

  const posting_url = $(el).val().trim();
  
    $.get(posting_url.substring(0, posting_url.length - 3), {}, function(data) {

      //console.log(data);

      if (data) {

        const { customFields } = data
        const { fields } = data
        if (fields && fields.length) {
          fields.forEach(static_field => {
            crm_fields.push({parameter: static_field.field, label: static_field.name, is_custom: false, required: static_field.required == true});
          });
        }
        if (customFields && customFields.length) {

          //console.log(customFields);
         
          customFields.forEach(custom_field => {
            crm_fields.push({parameter: custom_field._id, label: custom_field.name, is_custom: true, custom_type: custom_field.type, custom_options: custom_field.options });
            
          });
        }
        //store updated options for DB
        //init HTML selects

        if (!crm_fields.length) {
          updateOption($, 'json_array', 'click5_cf7_addon_crm_fields_stored', '');
          click5_cf7_addon_notification('error', 'Couldn\'t load CRM fields associated with current Posting URL.');

          $('li[data-value=error-log]').addClass('hidden');
          $('div[data-value=error-log]').addClass('hidden');

          crm_fields = [
            {
              parameter: '_undefined_',
              label: 'Please enter the Posting URL first'
            }
          ];
          
          updateOption($, 'url', 'click5_cf7_addon_posting_url', '');
          disableCheckboxes($);
          disableTabs();
          resetAllOptions($);
        
        } else {
          updateOption($, 'json_array', 'click5_cf7_addon_crm_fields_stored', JSON.stringify(crm_fields));
          click5_cf7_addon_notification('success', 'CRM fields has been loaded successfuly.');
          resetAllOptions($);
          enableCheckboxes($);
          updateOption($, 'url', 'click5_cf7_addon_posting_url', posting_url);
        }

        initSelects($);
        
      } else {
        // display error
        updateOption($, 'json_array', 'click5_cf7_addon_crm_fields_stored', '');
        click5_cf7_addon_notification('error', 'Couldn\'t load CRM fields.');
        crm_fields = [
            {
              parameter: '_undefined_',
              label: 'Please enter the Posting URL first'
            }
          ];
        
        disableCheckboxes($);
        disableTabs();
        resetAllOptions($);
        updateOption($, 'url', 'click5_cf7_addon_posting_url', '');
        initSelects($);
      }

    }).fail(function() {

          //console.log('invalid posting url');

          $('li[data-value=error-log]').addClass('hidden');
          $('div[data-value=error-log]').addClass('hidden');

          disableCheckboxes($);
          disableTabs();
          resetAllOptions($);
    });
}


function tryEnableFormIfNotEnabled($, id) {
  let inputCb = document.querySelector('input[type="checkbox"]#click5_cf7_addon_form_enable_' + id);
  if (inputCb && !inputCb.checked) {
    inputCb.checked = true;
    const dataCb = {
            type: 'bool',
            name: $(inputCb).attr('name'),
            val: '1'
    };
    updateOption($, dataCb.type, dataCb.name, dataCb.val);
  }
}


function toggleFormOptions(id) {
  document.querySelectorAll('.tab-content:not([data-value="'+id+'"])').forEach(tab_content => {
    tab_content.classList.remove('active');
  });
  document.querySelectorAll('.tab-headings > .nav > li:not([data-value="'+id+'"])').forEach(li => {
    li.classList.remove('active');
  });
  document.querySelector('.tab-content[data-value="'+id+'"]').classList.add('active');
  document.querySelector('.tab-headings > .nav > li[data-value="'+id+'"]').classList.add('active');

  if(id == 'error-log'){
    jQuery.post('/wp-json/click5_cf7_addon/API/reset_count_errors', {}, function(data) {
      if (data) {
        jQuery("li[data-value=error-log] span.count-errors").remove();
      }
    });
  }
}

function remove_const(form_id, id) {
  let new_const_values = []
  const_values.forEach(const_value => {
    if (const_value.form_id == form_id && const_value.id == id) {
      
    } else {
      new_const_values.push(const_value);
    }
  });
  const_values = new_const_values.slice();
}

function runConstantDisclaimerCheck() {
    document.querySelectorAll('ul.constants_list').forEach(list => {
        let form_id = list.getAttribute('data-value');
        if (list.childNodes.length > 0) {
            list.classList.remove('hidden_list');
            toggleConstantsDisclaimer(form_id, false);
        } else {
            list.classList.add('hidden_list');
            toggleConstantsDisclaimer(form_id, true);
        }
    });
}

function fetchConstValues($) {
  $.get('/wp-json/click5_cf7_addon/API/get_constants_AJAX', {}, function(data) {
    if (data) {
      data.forEach(element => {
        const_values.push(element);
        const { form_id } = element;
        let list = document.querySelector('ul.constants_list[data-value="'+form_id+'"]');
        if (list) {
          let liElement = document.createElement('li');
          liElement.setAttribute('data-value', JSON.stringify(element));
          
          const _json = JSON.parse(liElement.getAttribute('data-value'));

          liElement.innerHTML = `<span class="field">${element.label}</span><span class="value">${element.value}</span><span class="delete-item" data-id="${_json.id}" data-formid="${_json.form_id}">x</span>`;
          //liElement.innerHTML = `<span class="field">${element.label}</span><strong>&nbsp;=>&nbsp;</strong><span class="value">${element.value}</span><span class="delete-item" data-id="${_json.id}" data-formid="${_json.form_id}">x</span>`;
          
          list.append(liElement);


          liElement.querySelector('.delete-item').onclick = function() {

            if(confirm('Are you sure?')){
              liElement.remove();
              runConstantDisclaimerCheck();
              
              var get_id = this.getAttribute('data-id');
              var get_form_id = this.getAttribute('data-formid');

              remove_const(get_form_id, get_id);
              updateOption($, 'json', 'click5_cf7_addon_const_values', JSON.stringify(const_values));
            }
          }
        }
      });
    }
    runConstantDisclaimerCheck();
  });
}

function check_if_can_add_const(form_id, id) {
  let canAdd = true;
  const_values.forEach(const_value => {
    if (const_value.form_id == form_id && const_value.id == id) {
      canAdd = false;
    }
  });
  return canAdd;
}

function const_is_custom(parameter) {
  is_custom = undefined;

  crm_fields.forEach(field => {
    if (field.parameter == parameter) {
      is_custom = field.is_custom;
    }
  });

  return is_custom
}

function loadCRMfieldsToJS() {
  const stringJSON = document.querySelector('#phpCRMfields').value;
  crm_fields = JSON.parse(stringJSON);
}

function handleSelectMap(self) {
  let tickCheckbox = self.parentElement.parentElement.parentElement.querySelector('.tick > input[type="checkbox"]');
  if (self.value !== '_undefined_') {
    tickCheckbox.checked = true;
  } else {
    tickCheckbox.checked = false;
  }
}

function checkIfFieldsIsAlreadyMapped(parameter) {
  let found = false;

  document.querySelectorAll('select.map_to').forEach(select => {
    if (select.options[select.selectedIndex].value == parameter && parameter !== '_undefined_') {
      found = true;
    }
  });

  return found;
}

function createStaticNotification(type, message) {
  let uniqueID = Date.now() + Math.random();

  let div = document.createElement('div');
  div.setAttribute('id', uniqueID);
  div.setAttribute('data-value', JSON.stringify({
    uuid: uniqueID,
    type: type,
    message: message
  }));
  div.className = 'item';
  div.className += ' _' + type;
  //div.innerHTML = '<p>' + message + '</p><a href="#" class="close"><span class="dashicons dashicons-no"></span></a>';
  div.innerHTML = '<p>' + message + '</p>';

  document.querySelector('#crm_validation_notifications').append(div);
}

function handleRemovedCRMFields() {
  let changes = false;

  validate_fields.removed.forEach(field => {
    changes = true;

    //console.table(crm_fields);
    crm_fields = crm_fields.filter(x => x.parameter !== field.parameter);
    //console.table(crm_fields);

    if(checkIfFieldsIsAlreadyMapped(field.parameter)) {
      createStaticNotification('error', `<strong>${field.label}</strong>&nbsp;is no longer available in the CRM. Please update your plugin settings.`);

      
    } else {
      //pass that because it doesnt matter
      //createStaticNotification('warning', `<strong>${field.label}</strong>&nbsp;is no longer available in the CRM, but it doesn't affect the settings.`);
    }
  });

  return changes;
}
function handleModifiedCRMFields() {
  let changes = false;

  validate_fields.modified.forEach(field => {
    changes = true;

    let previousLabel = field.label;

    //console.table(crm_fields);

    crm_fields = crm_fields.map(x => {
      if (x.parameter == field.parameter) {
        previousLabel = x.label;
        x.label = field.label;
        x.is_custom = field.is_custom;
        x.required = field.required;
        x.custom_type = field.custom_type;
        x.custom_options = field.custom_options;
        return x;
      } else {
        return x;
      }
    });

    //console.table(crm_fields);

    if(checkIfFieldsIsAlreadyMapped(field.parameter)) {
      createStaticNotification('warning', `<strong>${previousLabel}</strong>&nbsp;has been modified in the CRM.${previousLabel !== field.label ? ` Now it's named <strong>${field.label}</strong>.` : ''}`);
    } else {
      //pass that because it doesnt matter
    }
  });

  return changes;
}
function handleNewCRMFields() {
  let changes = false;

  validate_fields.new.forEach(field => {
    changes = true;

    crm_fields.push(field);

    createStaticNotification('success', `<strong>${field.label}</strong>&nbsp;is your new CRM field. You can now setup that field.`);
  });


  return changes;
}

function saveNotificationsToDb($) {
  let arrayNotificationsPushToDb = [];
  document.querySelectorAll('#crm_validation_notifications > .item').forEach(notification => {
    let dataValueObject = notification.getAttribute('data-value');
    if (dataValueObject) {
      if (dataValueObject.length) {
        arrayNotificationsPushToDb.push(JSON.parse(dataValueObject));
      }
    }
  });
  if (arrayNotificationsPushToDb.length) {
    $.post('/wp-json/click5_cf7_addon/API/post_notifications', { new_notifications: arrayNotificationsPushToDb }, function(data) {
    });
  }
}

function handleCRMTest($) {

  let changeRemoved = handleRemovedCRMFields();
  let changeModified = handleModifiedCRMFields();
  let changeNew = handleNewCRMFields();

  saveNotificationsToDb($);

  if (changeRemoved || changeModified || changeNew) {
    // run update crm_fields to database

    updateOption($, 'json_array', 'click5_cf7_addon_crm_fields_stored', JSON.stringify(crm_fields));
    reinitSelects($);
    if (changeRemoved) {
      saveSelects($);
    }
  }
}

function removeNotification($, id) {
  $.post('/wp-json/click5_cf7_addon/API/post_remove_notification', { idRmv: id }, function(data) {
  });
}

function testFiledsCRMupdate($, p_url) {
  validate_crm_fields = []
  

  const posting_url = p_url.trim();
  
    $.get(posting_url.substring(0, posting_url.length - 3), {}, function(data) {
      if (data) {

        //console.log(data);

        const { customFields } = data
        const { fields } = data
        if (fields && fields.length) {
          fields.forEach(static_field => {
            validate_crm_fields.push({parameter: static_field.field, label: static_field.name, is_custom: false, required: static_field.required == true});
          });
        }
        if (customFields && customFields.length) {
          customFields.forEach(custom_field => {
            validate_crm_fields.push({parameter: custom_field._id, label: custom_field.name, is_custom: true, required: custom_field.required == true, custom_type: custom_field.type, custom_options: custom_field.options });
          });
        }
/*
        console.log('===== crm_fields (array) ======');
        console.table(crm_fields);

        console.log('====== validate_crm_fields (array) ======');
        console.table(validate_crm_fields);
*/
        validate_fields.removed = crm_fields.filter(x => !validate_crm_fields.map(y => y.parameter).includes(x.parameter));
/*
        console.log('====== MISSING_FIELDS =======');
        console.table(validate_fields.removed);
*/
        validate_fields.new = validate_crm_fields.filter(x => !crm_fields.map(y => y.parameter).includes(x.parameter));
/*
        console.log('======== NEW FIELDS =========');
        console.table(validate_fields.new);
*/
        validate_fields.modified = validate_crm_fields.filter(x => {
          return crm_fields.map(y => y.parameter).includes(x.parameter) && (!crm_fields.map(y => y.label).includes(x.label) ||
            !crm_fields.map(y => y.is_custom).includes(x.is_custom) ||
            !crm_fields.map(y => y.required).includes(x.required) ||
            !crm_fields.map(y => y.custom_field).includes(x.custom_field) ||
            !crm_fields.map(y => y.custom_options).includes(x.custom_options))
        });
/*
        console.log('======== MODIFIED FIELDS =========');
        console.table(validate_fields.modified);
*/
        handleCRMTest($);
      }

      document.querySelectorAll('#crm_validation_notifications > .item > a.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const IdRmv = this.parentElement.getAttribute('id');
          this.parentElement.remove();
          removeNotification($, IdRmv);
        });
      });
    });
}

function addClassNameListener(elem, callback) {
    var lastClassName = elem.className;
    window.setInterval( function() {   
      var className = elem.className;
        if (className !== lastClassName) {
            callback(elem);   
            lastClassName = className;
        }
    },10);
}

function detectDisabledChange(element) {
  if (element.className.includes('disabled')) {
    element.setAttribute('title', 'Paste an Posting URL to start');
  } else {
    element.setAttribute('title', '');
  }
}

function autoTooltipsToDisabled() {
  document.querySelectorAll('.disabled').forEach(disabledElement => {
    disabledElement.setAttribute('title', 'Paste an Posting URL to start');
    addClassNameListener(disabledElement, detectDisabledChange);
  });
}

function toggleForm(toggleForm, checked = true) {
  let tab = document.querySelector('div.tab-headings > ul > li[data-value="'+toggleForm+'"]');
  let tabContent = document.querySelector('.tab-content[data-value="'+toggleForm+'"]');
  if (tab && tabContent) {
    if(checked) {
      //enable Tab
      tab.classList.remove('hidden');
      tabContent.classList.remove('hidden');
      let countActive = document.querySelectorAll('div.tab-headings > ul > li.active').length;
      if (!(countActive > 0)) {
        //if no other forms are active set current to active
        tab.classList.add('active');
        tabContent.classList.add('active');
      }
    } else {
      // disable Tab
      tab.classList.add('hidden');
      tabContent.classList.add('hidden');
      if (tab.classList.contains('active')) {
        // if tab is currently active disactivate it and find other we can activate
        tab.classList.remove('active');
        tabContent.classList.remove('active');

        //try find another enabled tabs
        let anotherEnabledTab = document.querySelector('div.tab-headings > ul > li:not([data-value="'+toggleForm+'"]):not(.hidden)');
        let anotherEnabledTabContent = document.querySelector('.tab-content:not([data-value="'+toggleForm+'"]):not(.hidden)');
        if (anotherEnabledTab && anotherEnabledTabContent) {
          anotherEnabledTab.classList.add('active');
          anotherEnabledTabContent.classList.add('active');
        }
      }
    }
  }

  //show/hide disclaimer
  let tabsEnabled = document.querySelectorAll('div.tab-headings > ul > li:not(.hidden)');
  let disclaimerElement = document.querySelector('div.tab-headings p.all-off-text');
  let tabHeadings = document.querySelector('div.tab-headings');
  if (disclaimerElement && tabHeadings) {
    if (tabsEnabled.length) {
      //hide
      disclaimerElement.classList.add('hidden');
      tabHeadings.classList.remove('empty');
    } else {
      //show
      disclaimerElement.classList.remove('hidden');
      tabHeadings.classList.add('empty');
    }
  }
}

function disableTabs() {
    for (let key in form_data) {
        toggleForm(key, false);
    }
}

function getFormsDataToJS() {
  let phpFormData = document.querySelector('#phpFormData');
  if (phpFormData) {
    const stringJSON = phpFormData.value;
    form_data = JSON.parse(stringJSON);
  }
}

function checkIfFieldIsMappedInForm(formId, parameter, select_name) {
    let mapped = false;

    if (parameter == '_undefined_') {
        return mapped;
    }

    document.querySelectorAll('select.map_to:not(.not-ajaxable)[data-value="'+formId+'"]').forEach(select => {
        if (select.value == parameter && select_name !== select.getAttribute('name')) {
            mapped = true;
        }
    });

    return mapped;
}

function validate_required_fields(form_id) {
  jQuery(function($){
    var arr = $('select[data-value='+form_id+'].map_to:not(.not-ajaxable)').map(function(){
      return this.value
    }).get();
    $('#validate-error-info_'+form_id+' span').remove();


    if( ($.inArray('firstName', arr) == -1 || $.inArray('lastName', arr) == -1) && $.inArray('name', arr) == -1 ){
      $('#validate-error-info_'+form_id).append('<span>All the required fields have not been mapped yet.</span>');
      $('.tab-headings li[data-value='+form_id+'] span.count-errors').show();
    } else {
      $('.tab-headings li[data-value='+form_id+'] span.count-errors').hide();
    }
  })
}


jQuery(document).ready(function($){
// ============= load global variables =========== //

  loadCRMfieldsToJS();
  getFormsDataToJS();
  fetchConstValues($);

// ============= end of global variables ============ //


  autoTooltipsToDisabled();

  const posting_url = $('#click5_cf7_addon_posting_url').val();

  $('#click5_cf7_addon_posting_url').on('input', debounce(function() {
    getRequestCRM($, this);
  }, 500));
  if (posting_url.length) {
    //test if fields hasnt been updated
    testFiledsCRMupdate($, posting_url);
  }

  function round_tick_status(chk){

    if ( $(chk).is(':checked') && $(chk).closest('.map-field').find('select.map_to').val() != '_undefined_' ) {

      $(chk).closest('.map-field').find('.round input[type=checkbox]').prop('checked', true);

    } else {

      $(chk).closest('.map-field').find('.round input[type=checkbox]').prop('checked', false);

    }
  }

  $('.map-field .enable input[type=checkbox]').change(function () {
      round_tick_status(this);
  });

  $( ".map-field .enable input[type=checkbox]" ).each(function( index ) {
      round_tick_status(this);
  });


  $( "div.tab-content" ).each(function() {
    var form_id = $(this).data('value');
    if(form_id != 'error-log'){
      validate_required_fields(form_id);
    }
  });

  $(document).on('click', 'ul.constants_list li span:not(".delete-item"):not(".field")', function () {

      $( "input[name=change_constants], select[name=change_constants]" ).each(function() {
        $(this).parent().append('<span class="value">'+$(this).val()+'<span/>');
        $(this).parent().find('.value span').remove();
        $(this).remove();
      });

      var this_parameter = $(this).closest('li').data('value');
      var this_element = $(this);


      if(this_parameter.options_items){

        var input = $('<select />', {
            'name': 'change_constants'
        });

        var items_arr = this_parameter.options_items;
        $.each( items_arr, function( i, val ) {
          input.append($('<option>').val(val).text(val));
        });

        $('option[value="' + this_element.html() + '"]', input).prop('selected', true);

      } else {

        var input = $('<input />', {
          'type': 'text',
              'name': 'change_constants',
              'value': this_element.html()
        });

      }

      this_element.parent().append(input);
      this_element.remove();

  });

  $(document).on('blur', 'input[name=change_constants]', function () {

      $(this).parent().append('<span class="value">'+$(this).val()+'<span/>');
      $(this).parent().find('.value span').remove();

      const form_id = $(this).closest('.constants_list').data('value');
      const label = $(this).parent().find('.field').html();

      const token = $('#verification_token').val();
      const user = $('#user_identificator').val();

      let inputTextValue = $(this).val();

      $(this).remove();

      if (inputTextValue) {
        
        $.ajax({
          type: 'POST',
          url: '/wp-json/click5_cf7_addon/API/edit_const_option_AJAX',
          headers: {
              "token": token,
              "user": user
          },
          data: {
            label: label,
            form_id: form_id,
            value: inputTextValue
          }
        });
        
      }
  });

  $(document).on('change', 'select[name=change_constants]', function () {

    $(this).parent().append('<span class="value">'+$(this).val()+'<span/>');
    $(this).parent().find('.value span').remove();

    const form_id = $(this).closest('.constants_list').data('value');
    const label = $(this).parent().find('.field').html();

    const token = $('#verification_token').val();
    const user = $('#user_identificator').val();

    let inputTextValue = $(this).val();

    $(this).remove();

    if (inputTextValue) {
      
      $.ajax({
        type: 'POST',
        url: '/wp-json/click5_cf7_addon/API/edit_const_option_AJAX',
        headers: {
            "token": token,
            "user": user
        },
        data: {
          label: label,
          form_id: form_id,
          value: inputTextValue
        }
      });
      
    }
  });


  $('input[type="text"]:not(#click5_cf7_addon_posting_url):not(.not-ajaxable)').on('input', debounce(function() {
    const data = {
      type: 'text',
      name: $(this).attr('name'),
      val: $(this).val()
    };
    updateOption($, data.type, data.name, data.val);
  }, 150));
  $('input[type="checkbox"]:not(.not-ajaxable)').on('input', debounce(function() {
    const data = {
      type: 'bool',
      name: $(this).attr('name'),
      val: this.checked ? '1' : '0'
    };
    //console.log({nameCb: data.name});
    if (data.name.includes('click5_cf7_addon_form_enable_')) {
      const toggleFormId = this.getAttribute('data-value');
      toggleForm(toggleFormId, this.checked);

      $('li[data-value=error-log]').removeClass('hidden');
      $('div[data-value=error-log]').removeClass('hidden');
    }
    updateOption($, data.type, data.name, data.val);
    /*if (this.classList.contains('enable_lvl2')) {
      tryEnableFormIfNotEnabled($, $(this).attr('data-value'));
    }*/
  }, 150));
  $('select.map_to:not(.not-ajaxable)').on('input', debounce(function() {
    //detect if same field is not mapped in given contact form

    const data = {
      type: 'text',
      name: $(this).attr('name'),
      val: $(this).val()
    };

    const FormId = this.getAttribute('data-value');
    if (checkIfFieldIsMappedInForm(FormId, data.val, data.name)) {
        this.value = '_undefined_';
        data.val = '_undefined_';
        click5_cf7_addon_notification('warning', 'This CRM field has been already mapped in this form.');
    }

    handleSelectMap(this);
    //tryEnableFormIfNotEnabled($, $(this).attr('data-value'));
    let checkBoxEl = this.parentElement.parentElement.parentElement.querySelector('.enable > input[type="checkbox"]');
    if (checkBoxEl) {
      checkBoxEl.checked = true;
      updateOption($, data.type, data.name, data.val, () => {
          const dataCb = {
            type: 'bool',
            name: $(checkBoxEl).attr('name'),
            val: checkBoxEl.checked ? '1' : '0'
          };
          updateOption($, dataCb.type, dataCb.name, dataCb.val);
      });
    } else {
      updateOption($, data.type, data.name, data.val);
    }

    validate_required_fields(FormId);
  }, 150));


  $('.add_constant_value select[name=crm_field]').on('input', debounce(function() {
    //detect if same field is not mapped in given contact form

    const data = {
      type: 'text',
      name: $(this).attr('name'),
      val: $(this).val(),
      custom_type: $('option:selected', this).attr('data-type'),
      custom_options: $('option:selected', this).attr('data-available-options')
    };

    const FormId = $(this).closest('.add_constant_value').data('value');

    if (checkIfFieldIsMappedInForm(FormId, data.val, data.name)) {
        this.value = '_undefined_';
        data.val = '_undefined_';
        click5_cf7_addon_notification('warning', 'This CRM field has been already mapped in this form.');
    }

    $(this).closest('.add_constant_value').find('select.value option').remove();

    if(data.custom_type == 'select' || data.custom_type == 'radio' || data.custom_type == 'checkbox-single'){

      var this_select = $(this);

      var arr = data.custom_options.split(',');
      $.each( arr, function( i, val ) {
        this_select.closest('.add_constant_value').find('select.value').append($('<option>').val(val).text(val));
      });

      $(this).closest('.add_constant_value').find('input.value').hide();
      $(this).closest('.add_constant_value').find('select.value').show();

    } else {
      $(this).closest('.add_constant_value').find('input.value').show();
      $(this).closest('.add_constant_value').find('select.value').hide();
    }

  }, 150));


  document.querySelectorAll('.tab-headings a.toggler').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const toggleId = this.getAttribute('data-value');
      toggleFormOptions(toggleId);
    });
  });



  document.querySelectorAll('form.add_constant_value button').forEach(buttonAdd => {
    buttonAdd.addEventListener('click', function(e) {
      e.preventDefault();

      const form_id = buttonAdd.getAttribute('data-value');

      
      let liElement = document.createElement('li');

      if(buttonAdd.parentElement.querySelector('input[type="text"].value').value.length > 0){
        var inputTextValue = buttonAdd.parentElement.querySelector('input[type="text"].value');
      } else {
        var inputTextValue = buttonAdd.parentElement.querySelector('select.value');
      }
      
      let selectField = buttonAdd.parentElement.querySelector('select.map_to');
      let thisForm = buttonAdd.parentElement;


      liElement.setAttribute('title', 'Delete');

      var x = buttonAdd.parentElement.querySelector('select.value');
      var options_arr = [];
      var i;
      for (i = 0; i < x.length; i++) {
        options_arr.push(x.options[i].text);
      }

      if (inputTextValue && selectField) {
        let item = {
          form_id: form_id,
          id: selectField.value,
          value: inputTextValue.value
        }

        if (item.id == '_undefined_') {
          return click5_cf7_addon_notification('warning', 'You have to select CRM field in order to add a new constant value.');
        }

        if (item.value.trim().length == 0) {
          return click5_cf7_addon_notification('warning', 'You have to enter an actual value in order to add a new constant value.');
        }

        if (!check_if_can_add_const(item.form_id, item.id)) {
          click5_cf7_addon_notification('warning', 'Value for this field already exist.');
          return;
        }

        let label = '';
        selectField.querySelectorAll('option').forEach(option => {
          if (option.value == item.id) {
            label = option.label;
          }
        });


        let is_custom = const_is_custom(item.id);
        if (is_custom !== undefined) {
          item = Object.assign({is_custom: is_custom}, item);
        }

        if (Array.isArray(options_arr) && options_arr.length) {
          item = Object.assign(item, {options_items: options_arr});
        }

        if (label.length) {
          item = Object.assign({label: label}, item);


          const txtVal = item.value;
          const txtField = item.label;
          const txtID = item.id;
          const txtFormID = item.form_id;

          liElement.setAttribute('data-value', JSON.stringify(item));

          liElement.innerHTML = `<span class="field">${txtField}</span><span class="value">${txtVal}</span><span class="delete-item" data-id="${txtID}" data-formid="${txtFormID}">x</span>`;
          //liElement.innerHTML = `<span class="field">${txtField}</span><strong>&nbsp;=>&nbsp;</strong><span class="value">${txtVal}</span><span class="delete-item" data-id="${txtID}" data-formid="${txtFormID}">x</span>`;

          let constant_list = this.parentElement.parentElement.querySelector('ul.constants_list')

          if (constant_list) {
            constant_list.append(liElement);
            const_values.push(item);

            updateOption($, 'json', 'click5_cf7_addon_const_values', JSON.stringify(const_values));
            inputTextValue.value='';
          }


          liElement.querySelector('.delete-item').onclick = function() {

            if(confirm('Are you sure?')){
              liElement.remove();
              runConstantDisclaimerCheck();
              
              var get_id = this.getAttribute('data-id');
              var get_form_id = this.getAttribute('data-formid');

              remove_const(get_form_id, get_id);
              updateOption($, 'json', 'click5_cf7_addon_const_values', JSON.stringify(const_values));
            }
          }
        }

      }

      thisForm.reset();

      runConstantDisclaimerCheck();
    });
  })
});

function toggleConstantsDisclaimer(formId, toggle = true) {
    let p = document.querySelector('p.no-values-yet[data-value="'+formId+'"]');
    if (p) {
        if (toggle) {
            p.classList.remove('hidden');
        } else {
            p.classList.add('hidden');
        }
    }
}