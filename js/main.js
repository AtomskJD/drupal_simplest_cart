// money prototype
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };


(function () {
	  function CustomEvent ( event, params ) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent( 'CustomEvent' );
	    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	    return evt;
	   }

	  CustomEvent.prototype = window.Event.prototype;

	  window.CustomEvent = CustomEvent;
})();


function Cart(_items) {
    var _this = this;
    var _event = new CustomEvent('build');

    // console.log(_items || "doddo");
    if (_items) {
        this.items = (JSON.parse(_items)) || [];
    } else this.items = [];

    //работает
    this.addItem = function(item) {
        var exists = false;

        for (var i = 0; i < this.items.length; i++) {
            if (isName(this.items[i], item.name)) {
                this.items[i].qty += 1;
                exists = true;
            }
        }
        if (!exists) {
            this.items.push(item);
        }
        window.dispatchEvent(_event);
    };
    // работает
    this.removeItem = function(itemName) {
        for (var i = 0; i < this.items.length; i++) {
            if (isName(this.items[i], itemName)) {
                this.items.splice(i, 1);
            }
        }
        window.dispatchEvent(_event);
    };

    // работает
    this.changeItem = function(itemName, qty) {
        for (var i = 0; i < this.items.length; i++) {
            if (isName(this.items[i], itemName)) {
                this.items[i].qty = qty;
            }
        }
        window.dispatchEvent(_event);
    };

    this.releaseCart = function() {
        this.items = [];
        jQuery.cookie('cart', '', { path: '/' });
        window.dispatchEvent(_event);
    };


    this.renderCartConsole = function() {
        console.log("==== CART ====");
        // возможно временное использование _this
        for (var i = 0; i < _this.items.length; i++) {
            console.log(_this.items[i].name + " => " + _this.items[i].qty);
        }
        console.log('Count items: ' + _this.getCount());
    };

    // this.isInCart

    this.getBlockData = function() {
        var count = 0,
            summ = 0;

        for (var i = 0; i < this.items.length; i++) {
            count += this.items[i].qty * 1;
            summ += (this.items[i].cost * 1) * (this.items[i].qty * 1);
        }

        return { count: count, summ: (summ).formatMoney(2, ',', ' ') };
    };

    this.renderCheckout = function() {
        var output = '<div class="cart-checkout">';
        output += '<h2>Оформите ваш заказ</h2>';
        output += '<div class="cart-form-user-data"><div class="line-field"><label for="username">Ваше имя/Наименование организации</label><input required type="text" name="username" id="username"></div><div class="line-field"><label for="email">Ваш email</label><input required type="email" name="email" id="email"></div><div class="line-field"><label for="tel">Ваш телефон</label><input type="tel" name="tel" id="tel"></div><div class="line-field"><label for="file">Прикрепить реквизиты</label><input type="file" name="file" id="file"></div></div>';
        output += '<ul class="cart-checkout-list">';
        for (var i = 0; _this.items.length > i; i++) {
            output += '<li><span class="name" title=' + _this.items[i].name + '>' + _this.items[i].name.substr(0, 100) + '</span> <input type="number" class="qty" name="qty" min="1" value="' + _this.items[i].qty + '" data-name="' + _this.items[i].name + '"> <a href="#" class="del" data-name="' + _this.items[i].name + '">X</a></li>';
        }
        output += '</ul>';

        output += '<div class="result"><strong>Всего товаров: </strong>' + getResults(_this.items).count + '</br><strong>Итого: </strong>' + getResults(_this.items).summ + ' руб.</div>';

        output += '<div class="cart-send-line"><button class="btn-send-order">Отправить заказ</button></div>';

        return output;
    };

    this.checkout = function() {

    };

    this.cartSave = function() {
        jQuery.cookie("cart", JSON.stringify(this.items), { path: '/' });
    };

    
    this.getSum = function() {
        var summ = 0;

        for (var i = 0; i < _this.items.length; i++) {
            summ += (_this.items[i].cost * 1) * (_this.items[i].qty * 1);
        }

        return summ
    };


    this.getCount = function() {
        return _this.items.length;
    };

    function getResults(items) {
        var count = 0,
            summ = 0;

        for (var i = 0; i < items.length; i++) {
            count += items[i].qty * 1;
            summ += (items[i].cost * 1) * (items[i].qty * 1);
        }

        return { count: count, summ: (summ).formatMoney(2, ',', ' ') };
    }

    function isName(element, itemName) {
        return element.name == itemName;
    }
}



jQuery(function($) {
    myCart = new Cart($.cookie('cart'));



    window.addEventListener('build', function() {
        // myCart.renderCartConsole();
        myCart.getBlockData();
        myCart.cartSave();


        $('.cart-badge').text(myCart.getBlockData().count);
        $('.cart-cost').text(myCart.getBlockData().summ + " руб.");
        $('.view-taxonomynode .btn-add-to-cart').each(function(index, el) {
            for (var i = 0; i < myCart.items.length; i++) {
                if ($(this).data("name") == myCart.items[i].name) {
                    $(this).parents("tr").addClass('js-in-cart');
                }
            }
        });



        /////////////////////////
        // если чекаут открыт  //
        /////////////////////////

        $('#cboxLoadedContent').html(myCart.renderCheckout());
        $('.cart-checkout .del').click(function(event) {
            event.preventDefault();
            myCart.removeItem($(this).data('name'));
        });

        $('.cart-checkout .qty').change(function(event) {
            if ($(this).val() <= 0) {
                myCart.removeItem($(this).data('name'));
            }

            myCart.changeItem($(this).data('name'), $(this).val());
        });

        if ($.cookie('cart-user')) {
            ungroupUser(JSON.parse($.cookie('cart-user')));
        }

        $('.cart-form-user-data input').change(function(event) {
            $.cookie('cart-user', JSON.stringify(groupUser()), { path: '/' });
        });


        // files attachments AJAX implements
        var files;
        $('input#files').change(function(event) {
            files = this.files;
        });

        // DONE: сюда скопировать кусок для отправки почты с вложением
        console.log('send 1');
        // SEND BUTTON
        $('.btn-send-order').click(function(event) {
            checkForm(function(ok) {
                if (ok) {
                    var user = {};
                    user = groupUser();

                     // try attach files
                    // Create a formdata object and add the files
                    if (files) {
                        console.log(files);
                        var data = new FormData();
                        $.each(files, function(key, value)
                        {
                            data.append(key, value);
                        });

                        $.ajax({
                            url: '/simple-cart/send?files',
                            type: 'POST',
                            data: data,
                            cache: false,
                            dataType: 'text',
                            processData: false, // Don't process the files
                            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                            success: function(data, textStatus, jqXHR)
                            {
                                if(typeof data.error === 'undefined')
                                {
                                    // Success so call function to process the form
                                    // submitForm(event, data);
                                    console.log(data);
                                    console.log(JSON.parse(data).files);
                                     $.post("/simple-cart/send", { items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user, files: JSON.parse(data).files }).done(function(data) {

                                        // console.log(data);
                                        
                                        $.colorbox.close();
                                        myCart.releaseCart();
                                        setTimeout('location="/simple-cart/message";', 1000);
                                        

                                    });
                                }
                                else
                                {
                                    // Handle errors here
                                    console.log('SERVER ERRORS: ' + data.error);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown)
                            {
                                // Handle errors here
                                console.log('AJAX ERRORS: ' + textStatus);
                                // STOP LOADING SPINNER
                            }
                        });
                    } 
                    // try attach files END


                    else {
                        console.log(files);
                        // console.log({items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user});
                        $.post("/simple-cart/send", { items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user }).done(function(data) {

                            // console.log(data);

                            $.colorbox.close();
                            myCart.releaseCart();

                            setTimeout('location="/simple-cart/message";', 1000);

                        });
                    }


                };
            })
        });



        /////////////////////////
        // если чекаут открыт  //
        /////////////////////////



        $(".view-taxonomynode tr").removeClass('js-in-cart');
        $('.view-taxonomynode .btn-add-to-cart').each(function(index, el) {
            for (var i = 0; i < myCart.items.length; i++) {
                if ($(this).data("name") == myCart.items[i].name) {
                    $(this).parents("tr").addClass('js-in-cart');
                }
            }
        });


    }, false);

    // myCart.addItem({name: "tete", cost: "20.00", qty: 1});
    // myCart.addItem({name: "tete", cost: "20.00", qty: 1});
    // myCart.removeItem("test name");
    // myCart.changeItem("tete", 5);


    $('.cart-badge').text(myCart.getBlockData().count);
    $('.cart-cost').text(myCart.getBlockData().summ + " руб.");
    $('.view-taxonomynode .btn-add-to-cart').each(function(index, el) {
        for (var i = 0; i < myCart.items.length; i++) {
            if ($(this).data("name") == myCart.items[i].name) {
                $(this).parents("tr").addClass('js-in-cart');
            }
        }
    });

    $(".btn-add-to-cart").click(function(e) {
        e.preventDefault();
        var item = {
            name: $(this).data("name"),
            cost: $(this).data("cost"),
            qty: 1,
        }
        myCart.addItem(item);
    });


    $('.cart-block').click(function(event) {
        $.colorbox({ html: myCart.renderCheckout });
        $('.cart-checkout .del').click(function(event) {
            event.preventDefault();
            myCart.removeItem($(this).data('name'));
        });

        $('.cart-checkout .qty').change(function(event) {
            if ($(this).val() <= 0) {
                myCart.removeItem($(this).data('name'));
            }
            myCart.changeItem($(this).data('name'), $(this).val());
        });

        if ($.cookie('cart-user')) {
            ungroupUser(JSON.parse($.cookie('cart-user')));
        }

        $('.cart-form-user-data input').change(function(event) {
            $.cookie('cart-user', JSON.stringify(groupUser()));
        });


        // files attachments AJAX implements
        var files;
        $('input#file').change(function(event) {
            files = this.files;
        });


        //after clicking checkput button
        // SEND BUTTON
        $('.btn-send-order').click(function(event) {
            checkForm(function(ok) {
                if (ok) {
                    var user = {};
                    user = groupUser();

                    // try attach files
                    // Create a formdata object and add the files
                    if (files) {
                        console.log(files);
                        var data = new FormData();
                        $.each(files, function(key, value)
                        {
                            data.append(key, value);
                        });

                        $.ajax({
                            url: '/simple-cart/send?files',
                            type: 'POST',
                            data: data,
                            cache: false,
                            dataType: 'text',
                            processData: false, // Don't process the files
                            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                            success: function(data, textStatus, jqXHR)
                            {
                                if(typeof data.error === 'undefined')
                                {
                                    // Success so call function to process the form
                                    // submitForm(event, data);
                                    console.log(data);
                                    console.log(JSON.parse(data).files);
                                     $.post("/simple-cart/send", { items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user, files: JSON.parse(data).files }).done(function(data) {

                                        // console.log(data);
                                        
                                        $.colorbox.close();
                                        myCart.releaseCart();
                                        setTimeout('location="/simple-cart/message";', 1000);
                                        

                                    });
                                }
                                else
                                {
                                    // Handle errors here
                                    console.log('SERVER ERRORS: ' + data.error);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown)
                            {
                                // Handle errors here
                                console.log('AJAX ERRORS: ' + textStatus);
                                // STOP LOADING SPINNER
                            }
                        });
                    } 
                    // try attach files END


                    else {
                        console.log(files);
                        // console.log({items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user});
                        $.post("/simple-cart/send", { items: myCart.items, count: myCart.getCount(), summ: myCart.getSum(), user: user }).done(function(data) {

                            // console.log(data);

                            $.colorbox.close();
                            myCart.releaseCart();

                            setTimeout('location="/simple-cart/message";', 1000);

                        });
                    }


                };
            });
        });
    });

    function groupUser() {
        var user = {},
            username = $('.cart-form-user-data #username').val(),
            email = $('.cart-form-user-data #email').val(),
            tel = $('.cart-form-user-data #tel').val();
        return { username: username, email: email, tel: tel };
    }

    function ungroupUser(user) {
        $('.cart-form-user-data #username').val(user.username),
            $('.cart-form-user-data #email').val(user.email),
            $('.cart-form-user-data #tel').val(user.tel);

    }



    function checkForm(callback) {
        var ok = true,
            email = $(".cart-form-user-data #email").val();;
        $('.cart-form-user-data input').each(function(index, el) {
            if (($(this).attr('required')) && (!$(this).val())) {
                $(this).css("border-color", "red");
                ok = false;
            }
        });


        $.post("/simple-cart/mailcheck", { email: email }).done(function(data) {
            if (!data.mail_exists) {
                $(".cart-form-user-data #email").css("border-color", "red");
                ok = false;
            }
            callback(ok)
                // return ok;
        });

    }; //

});
