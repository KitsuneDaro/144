$(window).on('load', () => {
    resize();
});

$(window).on('resize', () => {
    resize();
});

function resize(){
    let innerWidth = $(window).innerWidth();
    let innerHeight = $(window).innerHeight();
    $('.all').css('height', innerHeight + 'px');
    $('.main').css('width', Math.min(innerHeight * 0.7, innerWidth) + 'px');
    $('.app').css('height', $('.app').width());
}