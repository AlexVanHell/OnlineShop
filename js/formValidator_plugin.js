(function ($) {
	$.fn.formValidatorPlugin = function( options ){

		var settings = $.extend({
			// Estos son los predeterminados
			checkboxConfirm: false,
			alertStyle : 'fill',
			nullMessage: '¡Completa este campo!',
			lettersMessage: 'Solo se permiten letras en este campo.',
			letters_numbersMessage: 'Solo se permiten numeros y letras en este campo',
			numbersMessage: 'Solo se permiten numeros en este campo.',
			emailMessage: 'Email invalido.',
			priceMessage: 'Intoruce un formato valido de precio.',
			passwordMessage: 'Introduce caracteres validos',
			passwordConfirmMessage: 'Las contraseñas no coinciden.',
			checkFieldsMessage: 'Verifica los campos'

		}, options );

        return this.each( function() {
        	var _this = $(this);
        	var flag = false;
        	var boolObject = {};
        	boolObject.textField = [];
        	boolObject.passwordMatchField = [];
        	boolObject.passwordMatchField.boolValue = true;
        	boolObject.checkbox = true;
        	if (settings.checkboxConfirm === true) {
        		boolObject.checkbox = false;
        	}

        	_this.find('input[type="text"], input[type="password"], textarea').each(function( index ){
        		var alertObject = {};
        		var validationType = $(this).attr('validation-type');
        		var input = $(this);
        		var inputType = input.attr('type');
        		var isRequired = input.attr('required-field');

        		alertObject.message = '';
        		if ( typeof isRequired !== typeof undefined && isRequired !== false ) {
        			alertObject.message = settings.nullMessage;
        		}

        		if( validationType === 'passwordConfirm' ){
        			boolObject.passwordMatchField.push(alertObject);
        			if( typeof isRequired !== typeof undefined && isRequired !== false ){
        				boolObject.passwordMatchField.boolValue = false;
        			}
        		}
        		else{
        			alertObject.boolValue = true;
        			if ( typeof isRequired !== typeof undefined && isRequired !== false ) {
        				alertObject.boolValue = false;
        			}
        			boolObject.textField.push(alertObject);
        		}

				input.keyup(function(){
					input.siblings('div.foVP_alrmsm').remove();
					if ( input.val() === null || input.val().trim() === '' ) {
						if ( typeof isRequired !== typeof undefined && isRequired !== false ) {
							alertObject.message = settings.nullMessage;
							if( validationType !== 'passwordConfirm' ){
								alertObject.boolValue = false;
							}
						    showAlertMessage(input, alertObject.message);
						}
						else{
							alertObject.message = '';
							if( validationType === 'passwordConfirm' ){
								boolObject.passwordMatchField.boolValue = true;
							}
							else{
								alertObject.boolValue = true;
							}
							
						}
					}
					else {
						if ( validationType === 'passwordConfirm' ) {
							var variable = _this.find('input[type="password"][validation-type="passwordConfirm"]').eq(0).val();
							var variable2 = _this.find('input[type="password"][validation-type="passwordConfirm"]').eq(1).val();
							_this.find('input[type="password"][validation-type="passwordConfirm"]').eq(1).siblings('div.foVP_alrmsm').remove();

							if ( !validatePasswordMatch( variable, variable2 ) ) {
								boolObject.passwordMatchField.boolValue = false;
								showPasswordAlert(settings.passwordConfirmMessage);
							}
							else{
								boolObject.passwordMatchField.boolValue = true;
							}
						}
						else {
							var variable = input.val();
							var funcArray = [
								{ name: 'letters', functionName: validateLetters(variable), defaulMessage: settings.lettersMessage },
								{ name: 'numbers', functionName: validateNumbers(variable), defaulMessage: settings.numbersMessage },
								{ name: 'email', functionName: validateEmail(variable), defaulMessage: settings.emailMessage },
								{ name: 'price', functionName: validatePrice(variable), defaulMessage: settings.priceMessage },
								{ name: 'letters-numbers', functionName: validateLettersNumbers(variable), defaulMessage: settings.letters_numbersMessage },
								{ name: 'html', functionName: validateHtml(variable), defaulMessage: '' }
							];
					       	for ( var i = 0 ; i < funcArray.length ; i++ ) {
				       			if ( validationType === funcArray[i].name ){
			       					alertObject.boolValue = funcArray[i].functionName;

		        					if( !alertObject.boolValue ){
		        						alertObject.message = funcArray[i].defaulMessage;
		        						showAlertMessage(input, alertObject.message);
		        					}
		       					}
			       			}
						}
					}
        		});
        	});

        	if( settings.checkboxConfirm === true ){
	        	_this.find('input[type="checkbox"]').on('change', function(){
	        		if( $(this).prop('checked') === true ){
	        			boolObject.checkbox = true;
	        		}
	        		else{
	        			boolObject.checkbox = false;
	        		}
	        	});
        	}

	        function showAlertMessage(input, message){
	        	var element = input.parent();
		        if(element.find('div.foVP_alrmsm').length < 1){
			        if(settings.alertStyle === 'minimal'){
			        	element.append('<div class="foVP_alrmsm" style="width: auto;margin-top: 4px;color: #EF5350;text-align: left;">' + message + '</div>')
			        }
			        else if(settings.alertStyle === 'fill'){
			        	element.append('<div class="foVP_alrmsm" style="width: auto;padding: 8px;background-color: #EF5350;color: #fff;text-align: left;">' + message + '</div>')
			        }
				}
		    }

		    function showPasswordAlert(message){
		    	var element = _this.find('input[type="password"][validation-type="passwordConfirm"]').eq(1).parent();
		    	if(element.find('div.foVP_alrmsm').length < 1){
		    		if(settings.alertStyle === 'minimal'){
			        	element.append('<div class="foVP_alrmsm" style="width: auto;margin-top: 4px;color: #EF5350;text-align: left;">' + message + '</div>')
			        }
			        else if(settings.alertStyle === 'fill'){
			        	element.append('<div class="foVP_alrmsm" style="width: auto;padding: 8px;background-color: #EF5350;color: #fff;text-align: left;">' + message + '</div>')
			        }
		    	}
		    }

			_this.submit(function(event){
				var flag_submit = false;
				var passValue = boolObject.passwordMatchField.boolValue;

				_this.find('input[required-field], textarea[required-field]').each(function(){
					if( $(this).val() === null || $(this).val().trim() === '' ){
						showAlertMessage($(this), settings.nullMessage);
					}
				});

	    		for ( var i = 0 ; i < boolObject.textField.length ; i++ ) {
	    			if ( boolObject.textField[i].boolValue === false) {
	    				flag = false;
	    				break;
	    			}
	    			else {
	    				flag = true;
	    			}
	    		}

	    		if ( passValue !== true || flag !== true || boolObject.checkbox !== true ) {
	    			flag_submit = false;
	    		}
	    		else {
	    			flag_submit = true;
	    		}

	    		if(!flag_submit){
	    			event.preventDefault();
	    			alert(settings.checkFieldsMessage);
	    		}

	    	});
        });

	};

	function validateNumbers(variable){
    	var patron = /^[0-9]*$/;
		return !variable.search(patron) && variable.length !== 0;
    }

	function validateLetters(variable){
		var patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
		return !variable.search(patron) && variable.length !== 0;
	}

	function validateLettersNumbers(variable){
		var patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]*$/;
		return !variable.search(patron);
	}

	function validateEmail(variable){
		var patron = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
		return !variable.search(patron);
	}

	function validatePrice(variable){
		var patron = /(?:\d*\.)?\d+/;
		return !variable.search(patron);
	}

	function validatePasswordMatch(variable, variable2){
		return variable === variable2 || ( variable === '' && variable2 === '' );
	}

	function validateHtml(variable){
		for (var i = 0; i < variable.length; i++) {
			if (variable[i] === '<') {
				variable[i] = '&lt;';
			}
			if (variable[i] === '>') {
				variable[i] = '&gt;';
			}
		}
		return variable;
	}

}(jQuery));
