<?php 


function surweb_cart_settings($form, &$form_state)
{
  
  $form['cart_node_type'] = array(
    '#type' => 'textfield',
    '#title' => 'Тип материала для отображения кнопки',
    '#default_value' => 'products',
    '#size' => 30,
    '#maxlength' => 60, 
    '#required' => TRUE,
  );

  $form['cart_node_cost'] = array(
    '#type' => 'textfield',
    '#title' => 'Идентификатор поля с ценой',
    '#default_value' => 'field_price',
    '#size' => 30,
    '#maxlength' => 60, 
    '#required' => TRUE,
  );
  return system_settings_form($form);
}