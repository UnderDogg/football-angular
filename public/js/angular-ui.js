
/**
 * @module ui
 * Bind Angular.js modules
 */
angular.module('ui.filters', []);
angular.module('ui.directives', []);
angular.module('ui', [
  'ui.filters', 
  'ui.directives'
]).value('ui.config', {});
// Generated by CoffeeScript 1.3.3

/*
 Gives the ability to style currency based on its sign.
*/
  angular.module('ui.directives').directive('uiCurrency', ['ui.config','currencyFilter' , function(uiConfig, currencyFilter) {
	  var options = {
	      pos: 'ui-currency-pos',
	      neg: 'ui-currency-neg',
	      zero: 'ui-currency-zero'
	};
	if (uiConfig.currency) {
		angular.extend(options, uiConfig.currency);
	}
    return {
      restrict: 'EAC',
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var opts, // instance-specific options
          renderview, 
          value;
      
        opts = angular.extend({}, options, scope.$eval(attrs.uiCurrency));
        
        renderview = function(viewvalue) {
          var num;
          num = viewvalue * 1;
          if (num > 0) {
            element.addClass(opts.pos);
          } else {
            element.removeClass(opts.pos);
          }
          if (num < 0) {
            element.addClass(opts.neg);
          } else {
            element.removeClass(opts.neg);
          }
          if (num === 0) {
            element.addClass(opts.zero);
          } else {
            element.removeClass(opts.zero);
          }
          if (viewvalue === '') {
            element.text('');
          } else {
            element.text(currencyFilter(num, opts.symbol));
          }
          return true;
        };
        value = '';
        if (controller != null) {
          controller.$render = function() {
            value = controller.$viewValue;
            element.val(value);
            renderview(value);
          };
        } else {
          if (attrs.num != null) {
            value = scope[attrs.num];
          }
          renderview(value);
        }
      }
    };
  }]);

// Generated by CoffeeScript 1.3.3
/*
 jQuery UI Datepicker plugin wrapper
 
 @param [ui-date] {object} Options to pass to $.fn.datepicker() merged onto ui.config
*/

angular.module('ui.directives').directive('uiDate', [
  'ui.config', function(uiConfig) {
    var options;
    options = {};
    if (uiConfig.date != null) {
      angular.extend(options, uiConfig.date);
    }
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var opts, originalRender, updateModel, usersOnSelectHandler;
        opts = angular.extend({}, options, scope.$eval(attrs.uiDate));
        if (controller != null) {
          updateModel = function(value, picker) {
            return scope.$apply(function() {
              return controller.$setViewValue(element.datepicker("getDate"));
            });
          };
          if (opts.onSelect != null) {
            usersOnSelectHandler = opts.onSelect;
            opts.onSelect = function(value, picker) {
              updateModel(value);
              return usersOnSelectHandler(value, picker);
            };
          } else {
            opts.onSelect = updateModel;
          }
          originalRender = controller.$render;
          controller.$render = function() {
            originalRender();
            return element.datepicker("setDate", controller.$viewValue);
          };
        }
        return element.datepicker(opts);
      }
    };
  }
]);

/**
 * General-purpose Event binding. Bind any event not natively supported by Angular
 * Pass an object with keynames for events to ui-event
 * 
 * @example <input ui-event="{ focus : 'counter++', blur : 'someCallback()' }">
 * 
 * @param ui-event {string|object literal} The event to bind to as a string or a hash of events with their callbacks
 */
angular.module('ui.directives').directive('uiEvent', [function() {
	return function(scope, elm, attrs) {
		var events = scope.$eval(attrs.uiEvent);
		angular.forEach(events, function(event, key){
			elm.bind(key, function() {
				scope.$apply(event);
			});
		});
	};
}]);


/**
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 * 
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 * 
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 * 		Multiple parameters can be separated by commas
 * 
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter">
 */
angular.module('ui.directives').directive('uiJq', ['ui.config', function(uiConfig) {
	var options = {};
	return {
		link: {
			post: function(scope, elm, attrs) {
				var evalOptions;
				if (uiConfig['jq'] && uiConfig['jq'][attrs.uiJq]) {
					if (angular.isObject(options) && angular.isObject(uiConfig['jq'][attrs.uiJq])) {
						angular.extend(options, uiConfig['jq'][attrs.uiJq]);
					} else {
						options = uiConfig['jq'][attrs.uiJq];
					}
				}
				if (attrs.uiOptions) {
					evalOptions = scope.$eval('['+attrs.uiOptions+']');
					if (angular.isObject(options) && angular.isObject(evalOptions[0])) {
						angular.extend(options, evalOptions[0]);
					} else {
						options = evalOptions[0];
					}
				}
				elm[attrs.uiJq](options);
			}
		}
	};
}]);


/**
 * Bind one or more handlers to particular keys or their combination
 * @param hash {mixed} keyBindings Can be an object or string where keybinding expression of keys or keys combinations and AngularJS Exspressions are set. Object syntax: "{ keys1: expression1 [, keys2: expression2 [ , ... ]]}". String syntax: ""expression1 on keys1 [ and expression2 on keys2 [ and ... ]]"". Expression is an AngularJS Expression, and key(s) are dash-separated combinations of keys and modifiers (one or many, if any. Order does not matter). Supported modifiers are 'ctrl', 'shift', 'alt' and key can be used either via its keyCode (13 for Return) or name. Named keys are 'backspace', 'tab', 'enter', 'esc', 'space', 'pageup', 'pagedown', 'end', 'home', 'left', 'up', 'right', 'down', 'insert', 'delete'.
 * @example <input ui-keypress="{enter:'x = 1', 'ctrl-shift-space':'foo()', 'shift-13':'bar()'}" /> <input ui-keypress="foo = 2 on ctrl-13 and bar('hello') on shift-esc" />
 **/
angular.module('ui.directives').directive('uiKeypress', [function(){
  return {
    link: function(scope, elm, attrs) {
      var keysByCode = {
        8:  'backspace',
        9:  'tab',
        13: 'enter',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'insert',
        46: 'delete'
      };

      var params, paramsParsed, expression, keys, combinations = [];
      try {
        params = scope.$eval(attrs.uiKeypress);
        paramsParsed = true;
      } catch (error) {
        params = attrs.uiKeypress.split(/\s+and\s+/i);
        paramsParsed = false;
      }

      // Prepare combinations for simple checking
      angular.forEach(params, function(v, k) {
        var combination = {};
        if(paramsParsed) {
          // An object passed
          combination.expression = v;
          combination.keys = k;
        } else {
          // A string passed
          v = v.split(/\s+on\s+/i);
          combination.expression = v[0];
          combination.keys = v[1];
        }
        combination.keys = combination.keys.split('-');
        combinations.push(combination);
      });

      // Check only mathcing of pressed keys one of the conditions
      elm.bind('keydown', function(event) {
        // No need to do that inside the cycle
        var altPressed   = event.metaKey || event.altKey;
        var ctrlPressed  = event.ctrlKey;
        var shiftPressed = event.shiftKey;

        // Iterate over prepared combinations
        angular.forEach(combinations, function(combination) {
          var mainKeyPressed = combination.keys.indexOf( keysByCode[event.keyCode] ) > -1 || combination.keys.indexOf( event.keyCode.toString() ) > -1

          var altRequired   =  combination.keys.indexOf('alt')   > -1;
          var ctrlRequired  =  combination.keys.indexOf('ctrl')  > -1;
          var shiftRequired =  combination.keys.indexOf('shift') > -1;

          if( mainKeyPressed &&
              ( altRequired   == altPressed   ) &&
              ( ctrlRequired  == ctrlPressed  ) &&
              ( shiftRequired == shiftPressed )
            ) {
            // Run the function
            scope.$eval(combination.expression);
          }
        });
      });
    }
  };
}]);

/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
	Version: 1.3
*/
(function($) {
	var pasteEventName = ($.browser.msie ? 'paste' : 'input') + ".mask";
	var iPhone = (window.orientation != undefined);

	$.mask = {
		//Predefined character definitions
		definitions: { 
			'9': "[0-9]",
			'a': "[A-Za-z]",
			'*': "[A-Za-z0-9]"
		},
		dataName:"rawMaskFn"
	};

	$.fn.extend({
		//Helper Function for Caret positioning
		caret: function(begin, end) {
			if (this.length == 0) return;
			if (typeof begin == 'number') {
				end = (typeof end == 'number') ? end : begin;
				return this.each(function() {
					if (this.setSelectionRange) {
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function() { return this.trigger("unmask"); },
		isMaskValid: function(){
			return $(this).data('mask-isvalid');
		},
		mask: function(mask, settings) {
			if (!mask && this.length > 0) {
				var input = $(this[0]);
				return input.data($.mask.dataName)();
			}
			settings = $.extend({
				placeholder: "_",
				completed: null
			}, settings);

			var defs = $.mask.definitions;
			var tests = [];
			var partialPosition = mask.length;
			var firstNonMaskPos = null;
			var len = mask.length;

			$.each(mask.split(""), function(i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if(firstNonMaskPos==null)
						firstNonMaskPos =  tests.length - 1;
				} else {
					tests.push(null);
				}
			});

			return this.trigger("unmask").each(function() {
				var input = $(this);
				var buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
				var focusText = input.val();

				function seekNext(pos) {
					while (++pos <= len && !tests[pos]);
					return pos;
				};
				function seekPrev(pos) {
					while (--pos >= 0 && !tests[pos]);
					return pos;
				};

				function shiftL(begin,end) {
					if(begin<0)
					   return;
					for (var i = begin,j = seekNext(end); i < len; i++) {
						if (tests[i]) {
							if (j < len && tests[i].test(buffer[j])) {
								buffer[i] = buffer[j];
								buffer[j] = settings.placeholder;
							} else
								break;
							j = seekNext(j);
						}
					}
					writeBuffer();
					input.caret(Math.max(firstNonMaskPos, begin));
				};

				function shiftR(pos) {
					for (var i = pos, c = settings.placeholder; i < len; i++) {
						if (tests[i]) {
							var j = seekNext(i);
							var t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t))
								c = t;
							else
								break;
						}
					}
				};

				function keydownEvent(e) {
					var k=e.which;

					//backspace, delete, and escape get special treatment
					if(k == 8 || k == 46 || (iPhone && k == 127)){
						var pos = input.caret(),
							begin = pos.begin,
							end = pos.end;

						if(end-begin==0){
							begin=k!=46?seekPrev(begin):(end=seekNext(begin-1));
							end=k==46?seekNext(end):end;
						}
						clearBuffer(begin, end);
						shiftL(begin,end-1);
						isValid();						//twarogowski

						return false;
					} else if (k == 27) {//escape
						input.val(focusText);
						input.caret(0, checkVal());
						return false;
					}
				};

				function keypressEvent(e) {
					var k = e.which,
						pos = input.caret();
					if (e.ctrlKey || e.altKey || e.metaKey || k<32) {//Ignore
						return true;
					} else if (k) {
						if(pos.end-pos.begin!=0){
							clearBuffer(pos.begin, pos.end);
							shiftL(pos.begin, pos.end-1);
							isValid();						//twarogowski
						}

						var p = seekNext(pos.begin - 1);
						if (p < len) {
							var c = String.fromCharCode(k);
							if (tests[p].test(c)) {
								shiftR(p);
								buffer[p] = c;
								writeBuffer();
								var next = seekNext(p);
								input.caret(next);
								isValid();						//twarogowski
								if (settings.completed && next >= len)
									settings.completed.call(input);
							}
						}
						return false;
					}
				};

				function clearBuffer(start, end) {
					for (var i = start; i < end && i < len; i++) {
						if (tests[i])
							buffer[i] = settings.placeholder;
					}
				};

				function writeBuffer() { return input.val(buffer.join('')).val(); };

				function isValid(){
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test.charAt(pos) && i!=partialPosition) {
							pos++;
							lastMatch = i;
						}
					}
					var valid = (lastMatch + 1 >= partialPosition);
					input.data('mask-isvalid',valid);
					return valid;
				}

				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test.charAt(pos) && i!=partialPosition) {
							pos++;
							lastMatch = i;
						}
					}
					if (!allow && lastMatch + 1 < partialPosition) {
						input.val("");
						clearBuffer(0, len);
					} else if (allow || lastMatch + 1 >= partialPosition) {
						writeBuffer();
						if (!allow) input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				};

				input.data($.mask.dataName,function(){
					return $.map(buffer, function(c, i) {
						return tests[i]&&c!=settings.placeholder ? c : null;
					}).join('');
				})

				if (!input.attr("readonly"))
					input
					.one("unmask", function() {
						input
							.unbind(".mask")
							.removeData($.mask.dataName);
					})
					.bind("focus.mask", function() {
						focusText = input.val();
						var pos = checkVal();
						writeBuffer();
						var moveCaret=function(){
							if (pos == mask.length)
								input.caret(0, pos);
							else
								input.caret(pos);
						};
						($.browser.msie ? moveCaret:function(){setTimeout(moveCaret,0)})();
					})
					.bind("blur.mask", function() {
						checkVal();
						if (input.val() != focusText)
							input.change();
					})
					.bind("keydown.mask", keydownEvent)
					.bind("keypress.mask", keypressEvent)
					.bind(pasteEventName, function() {
						setTimeout(function() { input.caret(checkVal(true)); }, 0);
					});

				checkVal(); //Perform initial check for existing values
			});
		}
	});
})(jQuery);
// Generated by CoffeeScript 1.3.3
/*
 Attaches jquery-ui input mask onto input element
*/

angular.module('ui.directives').directive('uiMask', [
  function() {
    return {
      require: 'ngModel',
      scope: {
        uiMask: '='
      },
      link: function($scope, element, attrs, controller) {
        controller.$render = function() {
          var value;
          value = controller.$viewValue || '';
          element.val(value);
          return element.mask($scope.uiMask);
        };
        controller.$parsers.push(function(value) {
          var isValid;
          isValid = element.data('mask-isvalid');
          controller.$setValidity('mask', isValid);
          return element.mask();
        });
        return element.bind('keyup', function() {
          return $scope.$apply(function() {
            return controller.$setViewValue(element.mask());
          });
        });
      }
    };
  }
]);

angular.module('ui.directives')
.directive('uiModal', [function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      scope.$watch(attrs.ngModel, function(value) {
          elm.modal(value && 'show' || 'hide');
      });
      elm.on('show.ui', function() {
        model.$setViewValue(true);
        if (!scope.$$phase) scope.$apply();
      });
      elm.on('hide.ui', function() {
        model.$setViewValue(false);
        if (!scope.$$phase) scope.$apply();
      });
    }
  };
}]);

/**
 * Actually removes html from the DOM instead of hiding it for assistance with 
 * CSS3 selectors such as :first-child, :last-child, etc
 * 
 * NOTE: This solution may not behave perfectly when used with or around other directives that also
 *   manipulate the dom.
 * 
 * @todo Add a more resilient solution to injecting removed elements back into the DOM (instead of relying on nextElm)
 * @param remove {boolean} condition to check if the element should be removed form the DOM
 */
angular.module('ui.directives').directive('uiRemove', [function() {
	return {
		link: function(scope, elm, attrs) {
			var parent = elm.parent();
			var expression = attrs.uiRemove;
			elm.data('ui-remove-index', elm.index());
			scope.$watch(expression, function(newValue, oldvalue) {
				var index, children, child;
				if (newValue) {
					elm.detach(); 
				} else if (!$.contains(parent, elm)) {
					index = elm.data('ui-remove-index');
					children = elm.parent().children();
					if (children.length > 0) {
						for (var i = 0; i < children.length; i++) {
							child = children[i];
							if (index > child.index() && i === children.length-1) {
								child.after(elm);
							} else {
								child.before(elm);
							}
						}
					} else {
						parent.append(elm);
					}
				}
			});
		}
	};
}]);
/**
 * Add a clear button to form inputs to reset their value
 */
angular.module('ui.directives').directive('uiReset', ['$parse', function($parse) {
	return function(scope, elm, attrs) {
		elm.wrap('<span class="ui-resetwrap" />').after('<a class="ui-reset" />').next().click(function(e){
			e.preventDefault();
			// This object is a 'parsed' version of the model
			var ngModel = $parse(attrs.ngModel);
			// This lets you SET the value of the 'parsed' model
			ngModel.assign(scope, null);
			scope.$apply();
		});
	};
}]);

/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('ui.directives').directive('uiScrollfix', [function() {
	return {
		link: {
			post: function(scope, elm, attrs) {
				var top = elm.offset().top;
				if (!attrs.uiScrollfix) {
					attrs.uiScrollfix = top;
				} else {
					if (attrs.uiScrollfix.indexOf('-') === 0) {
						attrs.uiScrollfix = top - attrs.uiScrollfix.substr(1);
					} else if (attrs.uiScrollfix.indexOf('+') === 0) {
						attrs.uiScrollfix = top + parseInt(attrs.uiScrollfix.substr(1));
					}
				}
				$(window).bind('scroll.ui-scrollfix', function(){
					if (!elm.hasClass('ui-scrollfix') && window.pageYOffset > attrs.uiScrollfix) {
						elm.addClass('ui-scrollfix');
					} else if (elm.hasClass('ui-scrollfix') && window.pageYOffset < attrs.uiScrollfix) {
						elm.removeClass('ui-scrollfix');
					}
				});
			}
		}
	};
}]);

/**
 * Enhanced Select2 Dropmenus
 *
 * @concerns When the plugin loads, it injects an extra DIV into the DOM below itself. This disrupts the
 *   compiler, breaking everything below. Because of this, it must be initialized asynchronously (late).
 *   Since the ng:model and ng:options/ng:repeat can be populated by AJAX, they must be monitored in order
 *   to refresh the plugin so that it reflects the selected value
 * @AJAX Multiselect - For these, you must use an <input>. The values will NOT be in the form of an Array,
 *   but a comma-separated list. You must adjust the value as needed before using accordingly
 * @params [options] {object} The configuration options passed to $().select2(). Refer to the documentation
 *   - [watch] {string} an expression to monitor for changes. For use with ng:repeat populated via ajax
 *   - [ajax.initial] {function(url, values, multiple)} a callback function that returns the query string
 *   		to retrieve initial information about preselected/default values
 */
angular.module('ui.directives').directive('uiSelect2', ['ui.config', '$http', function(uiConfig, $http){
	var options = {};
	if (uiConfig.select2) {
		angular.extend(options, uiConfig.select2);
	}
	return {
		require: '?ngModel',
		link: function(scope, elm, attrs, controller) {
		    // Indicates if the widget has been initialized atleast once or not. Please read default init above
			var init = true, 
				opts, // instance-specific options
				prevVal = '',
				loaded = false,
				multiple = false;
			
			if(typeof attrs.multiple !== 'undefined'){
			    multiple = true;
			}

			opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));
			
			if (!elm.is('select') && opts.ajax) {
				if(multiple){
					opts.multiple = true;
				}
				// Set the view and model value and update the angular template manually for the ajax/multiple select2.
				elm.bind("change", function(){
					controller.$setViewValue(elm.val());
					scope.$apply();
				});
			}

			function initialize(newVal) {
				setTimeout(function(){
					if (newVal !== undefined) {
						if (opts.ajax) {
							if (newVal && !$.isEmptyObject(newVal)) {
								if (init && opts.initial) {
									var url = opts.initial(opts.ajax.url, newVal, opts.multiple);
								    $http({ method: 'GET', url: url }).success(function(data, status, headers, config){
										data = opts.ajax.results(data);
										elm.select2('val', data.results || '');
									});
									init = false;
								}
							} else {
							    elm.select2('val', '');
							}
						} else {
							elm.select2('val', newVal);
						}
					}
				},0);
			}

			// Initialize the plugin late so that the injected DOM does not disrupt the template compiler
			// ToDo: $timeout service
			setTimeout(function(){
				elm.select2(opts);
				loaded = true;
				// If a watch was fired before initialized, set the init value
				initialize(prevVal);
			},0);

			// Watch the model for programmatic changes
			scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
				if (newVal === prevVal) {
					return;
				}
				if (loaded) {
					initialize(newVal);
					if (!newVal) {
					    // Push the model change to the view(only the null value in this case)
					    elm.select2('val', '');
					}
				}
				prevVal = newVal;
			});
			// If you want you can watch the options dataset for changes
			if (angular.isString(opts.watch)) {
				scope.$watch(opts.watch, function(newVal, oldVal, scope){
					if (loaded && prevVal) {
						setTimeout(function(){
							elm.select2('val', prevVal);
						},0);
					}
				});
			}
		}
	};
}]);


/**
 * NOTE: Only adds classes, you must add the class definition yourself
 */

/**
 * uiShow Directive
 *
 * Adds a 'ui-show' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
angular.module('ui.directives').directive('uiShow', [function() {
	return function(scope, elm, attrs) {
		scope.$watch(attrs.uiShow, function(newVal, oldVal){
			if (newVal) {
				elm.addClass('ui-show');
			} else {
				elm.removeClass('ui-show');
			}	
		});
	};
}])

/**
 * uiHide Directive
 *
 * Adds a 'ui-hide' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiHide', [function() {
	return function(scope, elm, attrs) {
		scope.$watch(attrs.uiHide, function(newVal, oldVal){
			if (newVal) {
				elm.addClass('ui-hide');
			} else {
				elm.removeClass('ui-hide');
			}
		});
	};
}])

/**
 * uiToggle Directive
 *
 * Adds a class 'ui-show' if true, and a 'ui-hide' if false to the element instead of display:block/display:none
 * Created to allow tighter control  of CSS without bulkier directives. This also allows you to override the
 * default visibility of the element using either class.
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiToggle', [function() {
	return function(scope, elm, attrs) {
		scope.$watch(attrs.uiToggle, function(newVal, oldVal){
			if (newVal) {
				elm.removeClass('ui-hide').addClass('ui-show');
			} else {
				elm.removeClass('ui-show').addClass('ui-hide');
			}
		});
	};
}]);
  angular.module('ui.directives').directive('uiTemplate', [
    function() {
      return {
        restrict: 'EAC', // supports using directive as element, attribute and class
        require: '?ngModel', // supports hanging optional ng-model as attribute for two-way data binding   
        link: function($scope, element, attrs, controller) {
          var controllerOptions, options, value = '';
          
          // NOTE: angular.extends does not behave the way I expect it to. Need to research more. 
          
          /* pull in your controller options
             1. check ui-options
             2. check uiTemplateOptions in scope
             3. set to empty hash
          */
          controllerOptions = $scope[attrs.options] || $scope.uiTemplateOptions || {};
          
          /* setup options by looking at each attribute on element, and 
           * if not there, check the controller options
           * or set to some default value
          */
          options = {
            someattr: attrs.someattr || controllerOptions.someattr || 'someDefaultValue'
          };
          
          // below is simplistic, but could do stuff, see ui-currency
          var renderView = function(value) {
            element.text(value);
          }
          
          // if you find a controller use this to do your rendering
          // NOTE: you must call controller.$render 
          if (controller != null) {
            controller.$render = function() {
              // ensure element has the controller's view value
              // TODO: find out from Pete what cases this is needed (see uiMask)
              var modelValue = controller.$viewValue;
              element.val(modelValue != null ? modelValue: ''); 
              renderView(controller.$viewValue);
            };
          } else {
        	// grab value from model
        	renderView($scope[attrs.somemodel] || '');
          } 
        }
      };
    }
  ]);


/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.directives').directive('uiTinymce', ['ui.config', function(uiConfig){
	uiConfig.tinymce = uiConfig.tinymce || {};
	return {
		require: 'ngModel',
		link: {
			post: function(scope, elm, attrs, ngModel) {
				var expression,
				  options = {
					// Update model on button click
					onchange_callback: function(inst) {
						if (inst.isDirty()) {
							inst.save();
							ngModel.$setViewValue(elm.val());
                            scope.$apply();
						}
					},
					// Update model on keypress
					handle_event_callback: function(e) {
						if (this.isDirty()) {
							this.save();
							ngModel.$setViewValue(elm.val());
                            scope.$apply();
						}
						return true; // Continue handling
					},
					// Update model when calling setContent (such as from the source editor popup)
					setup : function(ed) {
						ed.onSetContent.add(function(ed, o) {
							if (ed.isDirty()) {
								ed.save();
								ngModel.$setViewValue(elm.val());
								scope.$apply();
							}
						});
					}
				};
				if (attrs.uiTinymce) {
					expression = scope.$eval(attrs.uiTinymce);
				} else {
					expression = {};
				}
				angular.extend(options, uiConfig.tinymce, expression);
				elm.tinymce(options);
			}
		}
	};
}]);


/**
 * Adds a 'fixed' class to the element when the page scrolls past it's position.
 * @param expression {boolean} condition to check if it should be a link or not
 */
angular.module('ui.filters').filter('highlight', function() {
	return function(text, filter) {
		if (filter === undefined) {
			return text;
		} else {
			return text.replace(new RegExp(filter, 'gi'), '<span class="ui-match">$&</span>');
		}
	};
});

/**
 * Returns the length property of the filtered object
 */
angular.module('ui.filters').filter('length', function() {
	return function(value) {
		return value.length;
	};
});
/**
 * Converts variable-esque naming conventions to something presentational, capitalized words separated by space.
 * @param {String} value The value to be parsed and prettified.
 * @return {String}
 * @example {{ 'firstName' | prettify }} => First Name
 *          {{ 'last_name' | prettify }} => Last Name
 *          {{ 'home_phoneNumber' | prettify }} => Home Phone Number
 */
angular.module('ui.filters').
    filter('prettify', function () {
        return function (value) {
            return value
                //replace all _ and spaces and first characters in a word with upper case character
                .replace(/(?:_| |\b)(\w)/g, function(str, p1) { return p1.toUpperCase();})
                // insert a space between lower & upper
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                // space before last upper in a sequence followed by lower
                .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3');
        };
    });


/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
	if the key is empty, the entire object will be compared
	if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('ui.filters').filter('unique', function() {
	return function(items, key) {
		if (key && angular.isArray(items)) {
			var hashCheck = {},
				newItems = [];
			angular.forEach(items, function(item, key){
				var value;
				if (angular.isString(key)) {
					value = item[key];
				} else {
					value = item;
				}
				if (hashCheck[value] === undefined) {
					hashCheck[value] = true;
					newItems.push(item);
				}
			});
			items = newItems;
		}
		return items;
	};
});