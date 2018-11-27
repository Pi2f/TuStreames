var { google } = require('googleapis');
/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}
    
/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
// function createResource(properties) {
//     var resource = {};
//     var normalizedProps = properties;
//     for (var p in properties) {
//         var value = properties[p];
//         if (p && p.substr(-2, 2) == '[]') {
//         var adjustedName = p.replace('[]', '');
//         if (value) {
//             normalizedProps[adjustedName] = value.split(',');
//         }
//         delete normalizedProps[p];
//         }
//     }
//     for (var p in normalizedProps) {
//         // Leave properties that don't have values out of inserted resource.
//         if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
//         var propArray = p.split('.');
//         var ref = resource;
//         for (var pa = 0; pa < propArray.length; pa++) {
//             var key = propArray[pa];
//             if (pa == propArray.length - 1) {
//             ref[key] = normalizedProps[p];
//             } else {
//             ref = ref[key] = ref[key] || {};
//             }
//         }
//         };
//     }
//     return resource;
// }
          
          
module.exports = {
    searchListByKeyword: function (auth, requestData, res) {
        var service = google.youtube('v3');
        var parameters = removeEmptyParameters(requestData['params']);
        parameters['auth'] = auth;
        service.search.list(parameters, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var response = {
                success: true,
                data: response.data
            };
            res.send(response); 
        });
    }  
}