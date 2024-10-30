<?php
require('functions.php');

// for API authentication
function click5_cf7_addon_requestAuthentication($request) {
    $token = $request->get_header('token');
    $user = $request->get_header('user');
    $saved_token = get_option('click5_cf7_authentication_token_'.$user);
    $result = $saved_token ? ( $token ? ( strcmp($token, $saved_token) === 0 ) : false ) : false;
  
    return $result;
  }
  

function click5_cf7_addon_API_update_option_AJAX ( WP_REST_Request $request ) {
    //if (!click5_cf7_addon_requestAuthentication($request)) {
      //return false;
    //}
    $parameters = $request->get_body_params();
  

    $type = sanitize_text_field($parameters['type']);
    $optionName = sanitize_text_field($parameters['option_name']);
    $optionValue = sanitize_text_field($parameters['option_value']);
  
    //validate if we are targeting current plugin option
    /*
    if (!(strpos($optionName, 'click5_cf7_addon_') !== false)) {
      return false;
    }*/
  
    if ($type === 'bool')
      update_option($optionName, boolval($optionValue));
    else
      update_option($optionName, $optionValue);
  
    return true;
}


function click5_cf7_addon_API_edit_const_option ( WP_REST_Request $request ) {

  $parameters = $request->get_body_params();
  
  $optionLabel = sanitize_text_field($parameters['label']);
  $optionFormID = sanitize_text_field($parameters['form_id']);
  $optionValue = sanitize_text_field($parameters['value']);

  $get_json = json_decode(get_option('click5_cf7_addon_const_values'));

  foreach($get_json as $value){ 
    if($value->label == $optionLabel && $value->form_id == $optionFormID){

      $value->value = $optionValue;

    }
  }

  return update_option('click5_cf7_addon_const_values', json_encode($get_json));
  
}


function click5_cf7_addon_API_reset_all_options ( WP_REST_Request $request ) {

  $options_to_reset = array();

  $available_forms = click5_cf7_get_available_forms();
  foreach($available_forms as $key => $form_title) {
    $options_to_reset[] = 'click5_cf7_addon_form_enable_'.$key;
  
    $fields = click5_cf7_get_form_fields($key);
    foreach($fields as $field) {
      if (!$field['type']) {
        continue;
      }
      
      $options_to_reset[] = 'click5_cf7_addon_field_enabled_'.$key.'_'.$field['name'];
      $options_to_reset[] = 'click5_cf7_addon_map_to_'.$key.'_'.$field['name'];
    }
  }

  foreach($options_to_reset as $option_name) {
    update_option($option_name, '');
  }

  update_option('click5_cf7_addon_const_values', '');

  return true;
}


function click5_cf7_addon_API_get_constants( WP_REST_Request $request ) {
  return (array)(json_decode(get_option('click5_cf7_addon_const_values')));
} 

function click5_cf7_addon_API_get_notifications( WP_REST_Request $request ) {
  return (array)(json_decode(get_option('click5_cf7_addon_notifications')));
}

function click5_cf7_addon_API_post_remove_notification( WP_REST_Request $request ) {
  $parameters = $request->get_body_params();
  $idRmv = $parameters['idRmv'];

  if (empty($idRmv)) {
    return false;
  }

  $current_notifications = (array)(json_decode(get_option('click5_cf7_addon_notifications')));

  if (!is_array($current_notifications) || empty($current_notifications)) {
    $current_notifications = array();
  }

  $new_notifications = array();

  foreach($current_notifications as $notification) {
    $notification = (array)$notification;

    if($notification['uuid'] !== $idRmv) {
      $new_notifications[] = $notification;
    }
  }

  update_option('click5_cf7_addon_notifications', json_encode($new_notifications));

  return true;
} 

function click5_cf7_addon_API_post_notifications( WP_REST_Request $request ) {
  $current_notifications = (array)(json_decode(get_option('click5_cf7_addon_notifications')));

  if (!is_array($current_notifications) || empty($current_notifications)) {
    $current_notifications = array();
  }

  $parameters = $request->get_body_params();

  foreach($parameters['new_notifications'] as $notification) {
    $notification = (array)$notification;
    $current_notifications[] = $notification;
  }
  
  update_option('click5_cf7_addon_notifications', json_encode($current_notifications));
  
  //file_put_contents(dirname(__FILE__).'/debug.txt', 'RECIEVED: '.print_r((array)(json_decode(get_option('click5_cf7_addon_notifications'))), true));

  return true;
}


function click5_cf7_addon_API_get_error_logs( WP_REST_Request $request ){

  $parameters = $request->get_body_params();
  $json_decode = json_decode(get_option('click5_cf7_addon_notifications'), true);
  $json_decode = array_reverse($json_decode);

  $count = count($json_decode);

  if( ($parameters['last']+10) > $count ){
    $items = $count;
  } else {
    $items = $parameters['last']+10;
  }

  $new_array = array();
  for ($i = 0; $i < $items; $i++){
    $data = $json_decode[$i];
    if($data>0){
    $new_array[] = '<div id="'.$data['uuid'].'" class="item _'.$data['type'].'"><p>'.$data['message'].'</p></div>';
    }
  }

  $new_array[] = $parameters;

  return $new_array;

}

function click5_cf7_addon_API_reset_count_errors ( WP_REST_Request $request ) {
  return update_option('click5_cf7_addon_notifications_count_errors', '');
}


function click5_cf7_addon_find_date( $string ) {
	$shortenize = function( $string ) {
	  return substr( $string, 0, 3 );
	};
  
	// Define month name:
	$month_names = array(
	  "january",
	  "february",
	  "march",
	  "april",
	  "may",
	  "june",
	  "july",
	  "august",
	  "september",
	  "october",
	  "november",
	  "december"
	);
	$short_month_names = array_map( $shortenize, $month_names );
  
	// Define day name
	$day_names = array(
	  "monday",
	  "tuesday",
	  "wednesday",
	  "thursday",
	  "friday",
	  "saturday",
	  "sunday"
	);
	$short_day_names = array_map( $shortenize, $day_names );
  
	// Define ordinal number
	$ordinal_number = ['st', 'nd', 'rd', 'th'];
  
	$day = "";
	$month = "";
	$year = "";
  
	// Match dates: 01/01/2012 or 30-12-11 or 1 2 1985
	preg_match( '/([0-9]?[0-9])[\.\-\/ ]+([0-1]?[0-9])[\.\-\/ ]+([0-9]{2,4})/', $string, $matches );
	if ( $matches ) {
	  if ( $matches[1] )
		$day = $matches[1];
	  if ( $matches[2] )
		$month = $matches[2];
	  if ( $matches[3] )
		$year = $matches[3];
	}
  
	// Match dates: Sunday 1st March 2015; Sunday, 1 March 2015; Sun 1 Mar 2015; Sun-1-March-2015
	preg_match('/(?:(?:' . implode( '|', $day_names ) . '|' . implode( '|', $short_day_names ) . ')[ ,\-_\/]*)?([0-9]?[0-9])[ ,\-_\/]*(?:' . implode( '|', $ordinal_number ) . ')?[ ,\-_\/]*(' . implode( '|', $month_names ) . '|' . implode( '|', $short_month_names ) . ')[ ,\-_\/]+([0-9]{4})/i', $string, $matches );
	if ( $matches ) {
	  if ( empty( $day ) && $matches[1] )
		$day = $matches[1];
  
	  if ( empty( $month ) && $matches[2] ) {
		$month = array_search( strtolower( $matches[2] ),  $short_month_names );
  
		if ( ! $month )
		  $month = array_search( strtolower( $matches[2] ),  $month_names );
  
		$month = $month + 1;
	  }
  
	  if ( empty( $year ) && $matches[3] )
		$year = $matches[3];
	}
  
	// Match dates: March 1st 2015; March 1 2015; March-1st-2015
	preg_match('/(' . implode( '|', $month_names ) . '|' . implode( '|', $short_month_names ) . ')[ ,\-_\/]*([0-9]?[0-9])[ ,\-_\/]*(?:' . implode( '|', $ordinal_number ) . ')?[ ,\-_\/]+([0-9]{4})/i', $string, $matches );
	if ( $matches ) {
	  if ( empty( $month ) && $matches[1] ) {
		$month = array_search( strtolower( $matches[1] ),  $short_month_names );
  
		if ( ! $month )
		  $month = array_search( strtolower( $matches[1] ),  $month_names );
  
		$month = $month + 1;
	  }
  
	  if ( empty( $day ) && $matches[2] )
		$day = $matches[2];
  
	  if ( empty( $year ) && $matches[3] )
		$year = $matches[3];
	}
  
	// Match month name:
	if ( empty( $month ) ) {
	  preg_match( '/(' . implode( '|', $month_names ) . ')/i', $string, $matches_month_word );
	  if ( $matches_month_word && $matches_month_word[1] )
		$month = array_search( strtolower( $matches_month_word[1] ),  $month_names );
  
	  // Match short month names
	  if ( empty( $month ) ) {
		preg_match( '/(' . implode( '|', $short_month_names ) . ')/i', $string, $matches_month_word );
		if ( $matches_month_word && $matches_month_word[1] )
		  $month = array_search( strtolower( $matches_month_word[1] ),  $short_month_names );
	  }
  
	  $month = $month + 1;
	}
  
	// Match 5th 1st day:
	if ( empty( $day ) ) {
	  preg_match( '/([0-9]?[0-9])(' . implode( '|', $ordinal_number ) . ')/', $string, $matches_day );
	  if ( $matches_day && $matches_day[1] )
		$day = $matches_day[1];
	}
  
	// Match Year if not already setted:
	if ( empty( $year ) ) {
	  preg_match( '/[0-9]{4}/', $string, $matches_year );
	  if ( $matches_year && $matches_year[0] )
		$year = $matches_year[0];
	}
	if ( ! empty ( $day ) && ! empty ( $month ) && empty( $year ) ) {
	  preg_match( '/[0-9]{2}/', $string, $matches_year );
	  if ( $matches_year && $matches_year[0] )
		$year = $matches_year[0];
	}
  
	// Day leading 0
	if ( 1 == strlen( $day ) )
	  $day = '0' . $day;
  
	// Month leading 0
	if ( 1 == strlen( $month ) )
	  $month = '0' . $month;
  
	// Check year:
	if ( 2 == strlen( $year ) && $year > 20 )
	  $year = '19' . $year;
	else if ( 2 == strlen( $year ) && $year < 20 )
	  $year = '20' . $year;
  
	$date = array(
	  'year'  => $year,
	  'month' => $month,
	  'day'   => $day
	);
  
	if ( empty( $year ) && empty( $month ) && empty( $day ) )
	  return false;
	else
	  return $date;
}


function click5_cf7_remove_old_error_logs() {
  $current_notifications = (array)(json_decode(get_option('click5_cf7_addon_notifications')));
  if (!is_array($current_notifications) || empty($current_notifications)) {
    $current_notifications = array();
  }

  $i=0;
  foreach($current_notifications as $value){
    if($value->type != 'success'){
      $date = click5_cf7_addon_find_date($value->message);

      $string_date = $date['year'].'/'.$date['month'].'/'.$date['day'];

      $my_date = date('m-d-y', strtotime($string_date));

      if($my_date < date('m-d-y', strtotime('-3 months'))){
        unset($current_notifications[$i]);
      }
    }
    $i++;
  }
 update_option('click5_cf7_addon_notifications', json_encode($current_notifications));
}

add_action( 'rest_api_init', function () {
  register_rest_route('click5_cf7_addon/API', '/update_option_AJAX',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_update_option_AJAX',
    'permission_callback' => '__return_true',
  ) );

  register_rest_route('click5_cf7_addon/API', '/edit_const_option_AJAX',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_edit_const_option',
    'permission_callback' => '__return_true',
  ) );

  register_rest_route('click5_cf7_addon/API', '/reset_options_AJAX',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_reset_all_options',
    'permission_callback' => '__return_true',
  ) );
  register_rest_route('click5_cf7_addon/API', '/get_constants_AJAX',array(
    'methods' => 'GET',
    'callback' => 'click5_cf7_addon_API_get_constants',
    'permission_callback' => '__return_true',
  ) );

  register_rest_route('click5_cf7_addon/API', '/get_pagination_logs',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_get_error_logs',
    'permission_callback' => '__return_true',
  ) );
  register_rest_route('click5_cf7_addon/API', '/reset_count_errors',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_reset_count_errors',
    'permission_callback' => '__return_true',
  ) );
  register_rest_route('click5_cf7_addon/API', '/get_notifications',array(
    'methods' => 'GET',
    'callback' => 'click5_cf7_addon_API_get_notifications',
    'permission_callback' => '__return_true',
  ) );
  register_rest_route('click5_cf7_addon/API', '/post_notifications',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_post_notifications',
    'permission_callback' => '__return_true',
  ) );
  register_rest_route('click5_cf7_addon/API', '/post_remove_notification',array(
    'methods' => 'POST',
    'callback' => 'click5_cf7_addon_API_post_remove_notification',
    'permission_callback' => '__return_true',
  ) );
  
});
?>