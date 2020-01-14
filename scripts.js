jQuery(document).ready( function($){

    var valid=0;

    // Arrows and enter keys for search results
    $('.search-form').on("keydown", "#site-search", function (e) {
        
        var $listItems = $('.results li');
        var key = e.keyCode,
            $selected = $listItems.filter('.selected'),
            $current;
        
        if (key != 40 && key != 38 && key != 13)
            return;
        
        
        if (key == 40) // Down key
        {
            $listItems.removeClass('selected');
            if (!$selected.length || $selected.is(':last-child')) {
                $current = $listItems.eq(0);
            } else {
                $current = $selected.next();
            }
        } 
        else if (key == 38) // Up key
        {
            $listItems.removeClass('selected');
            if (!$selected.length || $selected.is(':first-child')) {
                $current = $listItems.last();
            } else {
                $current = $selected.prev();
            }
        } 
        else if (key == 13 && !valid) // Enter key
        {
            $current = $listItems.filter('.selected');
            $current.trigger('click');
            return false;
        }
        else if(key == 13 && valid) // Submit
        {
            $('#site-search').submit();
            return true;
        }
        $current.addClass('selected');
    });
    
    var timer;
    var delay = 1500; // 1.5 seconds delay after last input

    $('.search-form input').bind('input',function(){
        
        if(!$('#submit-btn').hasClass('invalid-param')){
            $('#submit-btn').addClass('invalid-param');
        }

        valid = 0;

        //For bigger inputs smaller delay
        if($('.search-form input').val().length<15){
            delay = 1000;
        }else if($('.search-form input').val().length>15){
            delay = 500;
        }
        if($('.search-form input').val().length<10){
            delay = 1500;
        }

        //console.log(delay);
        
        window.clearTimeout(timer);
        timer = window.setTimeout(function(){
            
            var keywords = $('.search-form input').val();

            //console.log(keywords);
            if(navigator.language || navigator.userLanguage == "el"){
                var language = "el";
            }else{
                var language = "en";
            }

            //console.log(language);

            if(keywords && language){
                $.getJSON('http://35.180.182.8/search?keywords='+keywords+'&language='+language+'', function(data) {
                    
                    //console.log(data);
                    $.each(data, function(index, val) {
                        $('.search-form ul').html("");
                        $.each(val, function(index, val) {

                            $('.search-form ul').append('<li>'+val.name+'</li>');
                            $('.search-form ul').addClass('open');

                            $('.search-form ul li').click(function(){
                                $('.search-form input#site-search').val($(this).text());
                                $('.search-form ul').html('');
                                $('.search-form ul').removeClass('open');
                                $('#submit-btn').removeClass('invalid-param');
                                valid = 1;
                                
                            });

                            //console.log(val.name);
                        });
                    });
                });
            }else{
                $('.search-form ul').html("");
                $('.search-form ul').removeClass('open');
            }
        },delay);
    });
})
