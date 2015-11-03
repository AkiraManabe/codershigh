$(function() {
    var wStatus = '';
    var BasicControl = {

        init: function() {
            this.seminarParticipants();
            if($('#jsiNewSeminar')[0]){
                this.seminarSlider();
            }
            if($('#jsiEventMap')[0]){
                this.mapDisplay();
            }
            if($('#seminarSubmitForm')[0]){
                this.seminarSubmit();
            }
            // this.gaEventTrack()


            /* ----------------------------------------
             // リサイズチェンジイベントの定義
             ---------------------------------------- */
            $(window).on('load resize', function(){
                var ww = $(this).width(),
                    event = new $.Event('winResize');
                if(window.matchMedia('screen and (max-width: 480px)').matches){
                    if(wStatus != 'xs'){
                        wStatus = 'xs';
                        $(this).trigger(event,wStatus);
                    }
                } else if(window.matchMedia('screen  and (min-width: 481px) and (max-width: 767px)').matches){
                    if(wStatus != 'sm'){
                        wStatus = 'sm';
                        $(this).trigger(event,wStatus);
                    }
                } else {
                    if(wStatus != 'mm'){
                        wStatus = 'mm';
                    }
                    $(this).trigger(event,wStatus);
                }
            });

            /* ----------------------------------------
             // モーダルオープン時サイズ調整
             ---------------------------------------- */
            $(window).on('shown.bs.modal resize load', function (e) {
                if($('body').hasClass('modal-open')){
                    var $modal = $('.modal.in'),
                        wHeight = window.innerHeight,
                        modalDialogMH = $modal.find('.modal-dialog').outerHeight(true) - $modal.find('.modal-dialog').outerHeight(),
                        modalHeadFootHeight = $modal.find('.modal-header').outerHeight() + $modal.find('.modal-footer').outerHeight(),
                        modalBodyScrHeight = $modal.find('.modal-body').get(0).scrollHeight,
                        $modalBackdrop = $modal.find('.modal-backdrop');
                    $modalBody = $modal.find('.modal-body');
                    if(wHeight < modalDialogMH + modalHeadFootHeight + modalBodyScrHeight ){
                        var newHeight = wHeight - modalDialogMH - modalHeadFootHeight;
//						$('body, html').height(window.innerHeight).css('overflow', 'hidden');
                        $modalBody.addClass('scroll').css({
                            'height': newHeight + 'px',
                            'overflow-y': 'scroll'
                        });
                    } else {
//						$('body, html').height('auto').css('overflow', '');
                        $modalBody.removeClass('scroll').css({
                            'height': 'auto',
                            'overflow-y': 'visible'
                        });
                    }
                    $modalBackdrop.height(wHeight);
                }
            });
            /*
             $('body, .modal-backdrop').on('click touchmove', function(e){
             console.log($(this).attr('class'))
             e.preventDefault();
             });
             */
            $('body').on('touchmove', function(e) {
                if($(this).hasClass('modal-open')){
                    $('.mainDetailBtn').text( $(e.target).closest('*').prop('tagName') + $(e.target).closest('.modal-body').size());
                    $('.modal-title').text( $(e.target).closest('*').prop('tagName') + $(e.target).closest('.modal-body').size());
                    if($(e.target).closest('.modal-body').size()){
                        if(!$(e.target).closest('.modal-body').hasClass('scroll')){
                            e.preventDefault();
                        } else {
                            e.stopPropagation();
                        }
                    } else {
                        e.preventDefault();
                    }
                }
            });
        },

        /* ----------------------------------------
         // 参加人数パーセント表示
         ---------------------------------------- */
        seminarParticipants: function() {
            $('[data-participants]').each(function(){
                var iAmount = parseInt($(this).attr('data-participants'),10);
                $(this).css('backgroundSize',iAmount + '% 100%');
            });
        },

        /* ----------------------------------------
         // セミナーカルーセル
         ---------------------------------------- */
        seminarSlider: function() {
            var ssNewLength = $('#jsiNewSeminar .seminarItem').size(),
                ssNowLength = $('#jsiNowSeminar .seminarItem').size(),
                ssHtml = '<li class="item"><a href="#"></a></li>',
                $ssCtrl = $('.newSeminarControl'),
                $ssNewList = $('.newSeminarList'),
                $ssNowList = $('.nowSeminarList'),
                $ssNewCasette = $('.newSeminarList').find('.seminarItem'),
                $ssNowCasette = $('.nowSeminarList').find('.seminarItem'),
                $ssNowMore = $('.nowSeminarMore');

            if(ssNewLength > 1){
                for(var i=0;i<ssNewLength;i++){
                    $ssCtrl.append($(ssHtml).clone());
                }
                $ssCtrl = $ssCtrl.find('.item');
                $ssCtrl.eq(0).addClass('current');
            }
            $ssCtrl.on('click', function(){
                if(!$(this).hasClass('current')){
                    var ssIndex = $ssCtrl.index(this);
                    $ssCtrl.removeClass('current').eq(ssIndex).addClass('current');
                    $ssNewCasette.removeClass('on').eq(ssIndex).addClass('on');
                    return false;
                }
            });

            if($ssNowCasette.size() < 4){
                $ssNowList.addClass('on');
                $ssNowMore.hide();
            } else {
                var ssNowLh;
                $(window).on('resize winResize', function(e,r){
                    if(e.type==='resize'){
                        if(!$ssNowList.hasClass('on')){
                            ssNowLh = ($ssNowCasette.eq(0).outerHeight())*3;
                            $ssNowList.css('height', ssNowLh + 'px');
                        } else {
                            $ssNowList.css('height', 'auto');
                        }
                    }
                    if(e.type==='winResize') {
                        if(r==='mm'){
                            $ssNowMore.hide();
                            $ssNowList.removeClass('on');
                            $ssNowList.css('height', 'auto');
                        } else {
                            if(!$ssNowList.hasClass('on')){
                                ssNowLh = ($ssNowCasette.eq(0).outerHeight())*3;
                                $ssNowList.css('height', ssNowLh + 'px');
                            } else {
                                $ssNowList.css('height', 'auto');
                            }
                        }
                    }
                });
            }

            $(window).on('winResize', function(e,r){
                if(r==='mm' || r==='sm'){
                    $('[data-shortTitle]').each(function(){
                        $(this).text($(this).attr('title'));
                    });
                } else {
                    $('[data-shortTitle]').each(function(){
                        $(this).text($(this).attr('data-shortTitle'));
                    });
                }
            });

            $ssNowMore.on('click', function(){
                $ssNowList.animate(
                    {
                        height: ((ssNowLh/3) * ssNowLength ) + 'px'
                    },
                    {
                        speed: 'fast',
                        duration: 'swing',
                        complete: function(){
                            $ssNowMore.hide();
                            $ssNowList.addClass('on');
                        }
                    }
                );
            });

            $('.mySeminarMenu :radio').on('change',function(){
                var iVal = '.' + $(this).val();
                $('.mySeminarList.on').animate(
                    {'opacity':0},
                    {
                        speed: 'fast',
                        duration: 'swing',
                        complete: function(){
                            $(this).removeClass('on');
                        }
                    }
                );
                $(iVal).addClass('on').animate(
                    {'opacity':1},
                    {
                        speed: 'fast',
                        duration: 'swing',
                    }
                );
            });
        },

        /* ----------------------------------------
         // イベントマップ表示
         ---------------------------------------- */
        mapDisplay: function() {
            var geocoder = new google.maps.Geocoder(),
                address = $('.mapDetail').text(),
                $map = $('.mapFigure figure');
            //住所から座標を取得する
            geocoder.geocode(
                {
                    'address': address,
                    'region': 'jp'
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        google.maps.event.addDomListener(window, 'load', function () {
                            var map_location = results[0].geometry.location,
                                map = new google.maps.Map(
                                    $map.get(0),
                                    {
                                        zoom: 16,
                                        center: map_location,
                                        disableDefaultUI: true,
                                        mapTypeId: google.maps.MapTypeId.ROADMAP
                                    }
                                ),
                                marker = new google.maps.Marker(
                                    {
                                        position: map_location,
                                        map: map
                                    }
                                );
                            if($('[data-maphref]')[0]){
                                google.maps.event.addListener(marker, 'click', function(){
                                    window.open($('[data-maphref]').attr('data-maphref'));
                                });
                            }
                        });
                    } else {
                        $map.css({
                            'padding': '60px 20px 20px',
                            'height': 'auto'
                        });
                        $map.html('申し訳ございません。<br>現在地図が表示できません。');
                    }
                }
            );
        },

        /* ----------------------------------------
         // セミナー送信
         ---------------------------------------- */
        seminarSubmit: function() {
            $('[type="submit"]').on('click', function(){
                var iVal = $(this).val(),
                    $form = $('#seminarSubmitForm'),
                    iUrl = $form.attr('action');
                if(iVal === 'join'){
                    $('#seminarModalJoin').modal();
                } else if(iVal === 'cencel'){
                    $('#seminarModalCancel').modal();
                } else if(iVal === 'commentChange'){
                    $('#seminarModalChange').modal();
                } else if(iVal === 'joinOK'){
                    $form.attr('action',iUrl + 'join/');
                    return true;
                } else if(iVal === 'cancelOK'){
                    $form.attr('action',iUrl + 'cancel/');
                    return true;
                } else if(iVal === 'commentChangeOK'){
                    $form.attr('action',iUrl + 'commentChange/');
                    return true;
                }
                return false;
            });
        },

        /* ----------------------------------------
         // google analytics イベントトラッキング
         ---------------------------------------- */
        gaEventTrack: function(){
            //data-link属性をつけたアンカーのリンク先を追跡
            $('[data-link]').click(function(){
                var label = $(this).attr('data-link');
                var url = $(this).attr('href');
                ga('send', 'event', 'link', label, url);
            });

            //modalのターゲットとカテゴリを追跡
            $('[data-target]').click(function(){
                if($($(this).attr('data-target'))[0]){
                    var $this = $($(this).attr('data-target'));
                    var cate = ($this.find('.diatitle')[0]) ? $this.find('.diatitle').text() : 'panel';
                    var target = ($this.find('.modal-title')[0]) ? $this.find('.modal-title').text() : 'unknown';
                    ga('send', 'event', 'modal', cate, target);
                }
            });
        }

    };

    BasicControl.init();

});