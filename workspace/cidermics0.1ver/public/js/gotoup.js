jQuery(document).ready(function($){
	//open-close submenu on mobile
	$('.cd-main-nav').on('click', function(event){
		if($(event.target).is('.cd-main-nav')) $(this).children('ul').toggleClass('is-visible');
	});
	

});

$(document).ready(function(){//top버튼
    var $body = $(document.body), //자주 사용하기에 캐시되게 변수에 넣어준다
		$top = '';

    $top=$('#but_top') //div 를 만들고 
            .addClass('gototop') //top className을 주고
            .hide() //처음에는 숨겨둔다
            .click(function(){  // 클릭이 이벤트 할당
				$('body,html').animate({ scrollTop: 0 }, 'slow');
            })
            .appendTo($body); // body에 top을 넣는다

    //윈도우의 스크롤위치로 위로가기 버튼을 보여줘야기에 핸들러 작성
    $(window).scroll(function(){

        var y = $(this).scrollTop();

        if(y >= 100){
            $top.fadeIn();
        }
        else {
            $top.fadeOut();
        }
    });
});