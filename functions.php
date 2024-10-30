<?php


function click5_cf7_get_available_forms() {
  if ( class_exists('WPCF7_ContactForm') ) {
      $posts = WPCF7_ContactForm::find();
      foreach ($posts as $post) {
          $array[$post->id()] = $post->title();
      }
      return $array;
  }
}

function click5_cf7_is_selected($option_name, $value) {
  return esc_attr(get_option($option_name)) == $value;
}

function click5_cf7_is_mapped($option_name) {
  $str_option = esc_attr(get_option($option_name));
  return $str_option !== '_undefined_' && strlen($str_option);
}

function click5_cf7_get_enabled_forms() {
  $available_forms = click5_cf7_get_available_forms();
  if ( class_exists('WPCF7_ContactForm') ) {
    $posts = WPCF7_ContactForm::find();
    $array = array();
    foreach ($posts as $post) {
      if (boolval(get_option('click5_cf7_addon_form_enable_'.$post->id()))) {
        $array[$post->id()] = $post->title();
      }
    }
    return $array;
  }
}

function click5_cf7_get_all_forms() {
  $allForms = click5_cf7_get_available_forms();
  $enabledForms = click5_cf7_get_enabled_forms();

  $result_array = array();
  foreach($allForms as $key => $title) {
    $is_enabled = false;
    foreach($enabledForms as $enabled_key => $enabled_title) {
      if ($key == $enabled_key) {
        $is_enabled = true;
      }
    }

    $result_array[$key] = array('title' => $title, 'is_enabled' => $is_enabled);
  }

  return $result_array;
}

function click5_cf7_get_available_crm_fields() {
  //request
  $array_fields = (array)json_decode(get_option('click5_cf7_addon_crm_fields_stored'));

  $isEmpty = true;

  if ($array_fields) {
    if (count($array_fields)) {
      $isEmpty = false;
    }
  }

  return !$isEmpty ? $array_fields : array(array('parameter' => '_undefined_', 'label' => 'Please enter the Posting URL first', 'is_custom' => false));
}

function click5_cf7_get_form_fields($id) {
  $meta = get_post_meta($id, '_form');
  if (!empty($meta)) {
    $fields_html = array_shift($meta);
    $re = "/(?<=\\[)([^\\]]+)/";
    $matches = array();
    preg_match_all($re, $fields_html, $matches);

    $matches = array_shift($matches);

    $result = array();
    foreach($matches as $match) {
      $attributes = explode(' ', $match);
      $current_tag = array();
      foreach($attributes as $attrib) {
        if (!isset($current_tag['type']) && strpos($attrib, ':') == false) {
          $current_tag['type'] = $attrib;
        } else if (!isset($current_tag['name']) && strpos($attrib, ':') == false) {
          $current_tag['name'] = $attrib;
        }
      }
      if ($current_tag['type'] == 'submit' || $current_tag['type'] == 'submit*') {
        continue;
      }
      $result[] = $current_tag;
    }
    return $result;
  } else {
    return array();
  }
}

function click5_cf7_get_const_values($form_id) {
  $allConstValues = (array)(json_decode(get_option('click5_cf7_addon_const_values')));
  $resultArray = array();

  foreach($allConstValues as $const_value) {
    $const_value = (array)$const_value;

    if ($const_value['form_id'] == $form_id) {
      $resultArray[] = $const_value;
    }
  }

  return $resultArray;
}


?>