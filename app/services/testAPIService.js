testRouting.factory('testAPIService', ['$http',  function($http) {
    var serv = {};

    serv.rechercher = function(keyword, cb) {
        var req = {
            keyword : keyword
        };
        $http.post('/testRechercher', req)
            .then(function(resp) {
                cb(resp.data);
            }, function(resp) {
                alert("Erreur");
            });
    };

    return serv;
    

    //use search ("keywords"[,  5]) / ou searchVideos pour les premiers tests
    //.then(results => {manipulation de $result nécessaire pour obtenir une liste de vidéo ? voire use une pour le parseUrl}).catch(console.error);
    //use parseURL

}]);
// Youtube data API V3 key
//AIzaSyDOpyVCh0Ajsq0UoGexoahIRFtNAiLP43E
