$.noConflict();

jQuery(document).ready(function(){
	// Este muestra u oculta el menu dependiendo del estado en el que este
	jQuery('#toggle_menu').click(function(){
		var menu = jQuery('#menu_hidden');
		if (menu.css('display') === 'block') {
			menu.fadeOut();
		}
		else{
			menu.fadeIn();
		}
	});

	// Este hace que se oculte el menu al dar click sobre cualquier parte de la pagina
	jQuery('html, body').click(function(){
		jQuery('#menu_hidden').fadeOut();
	});
	jQuery('#menu_hidden, #toggle_menu').click(function(event){
		// Este impide que se oculte el menu a la hora de hacerle click, ya que en la
		// funcion de arriba hace que se oculte al hacer click en cualquier parte
		event.stopPropagation();
	});

	checkTotal();

	jQuery('.quantity button').click(function(){
		var num = parseInt(jQuery(this).siblings('.number').text());
		if( jQuery(this).text() === '-' ){
			if ( num > 0 ) {
				num --;
			}
		}
		else if ( jQuery(this).text() === '+' ){
			num++;
		}
		jQuery(this).siblings('.number').text(num);
		checkTotal();
	});

	jQuery('.card .img_container').click(function(){
		jQuery('#pop_up .container').removeClass('pop_up_center');
		jQuery('#pop_up').fadeIn();
		if (jQuery(window).height() > jQuery('#pop_up .container').height()) {
			jQuery('#pop_up .container').addClass('pop_up_center');
		}
	});

	jQuery('#pop_up .back').click(function(){
		jQuery('#pop_up').fadeOut();
	});

});

function checkTotal(){
	// Este lo hice para hacer la pinche suma de los precios papuh :V Pero igual hazlo tu mejor xD
	var totalPrice = 0;
	var totalItems = 0;
	jQuery('.price').each(function(){
		var itemPrice = parseFloat(jQuery(this).find('span').text());
		var itemMulti = parseInt(jQuery(this).parents('.card').find('.cart_add .number').text());
		totalPrice = totalPrice + (itemPrice * itemMulti);
		totalItems = totalItems + itemMulti;
	});

	jQuery('[total]').text(totalPrice);
	jQuery('#totalItems').text(totalItems);
}