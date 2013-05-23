(function($){

var CF = {
    ajax : function(data, success, error){
        error = error || function(err){ alert(err) };
        $.ajax({
            url : '/do',
            type : 'post',
            dataType : 'json',
            data : data,
            success : function(d){
                if(d.Status > 0){
                    success(d.Data, d.StatusText);
                }
                else{
                    error(d.Error);
                }
            }
        });
    }
};




















window.CF = CF;

function initBootstrapPlug(){
    $('[rel="tooltip"]').tooltip();
}

$(function(){
    initBootstrapPlug();
});


})(jQuery);