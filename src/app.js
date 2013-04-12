// ############ MODELS ############

var User = Backbone.Model.extend({
  initialize: function(){}
});

// ############ COLLECTIONS ############

var UserCollection = Backbone.Collection.extend({
  model: User,
  url: 'https://api.github.com/users'        
});

// ############ VIEWS ############

var AppView = Backbone.View.extend({
  el: $('#main_content'),
  //events: {},
  initialize: function() {
    // initial data fetch
    myCollection.fetch({
      success: function(collection, response){
        // insert data into local db

        // _.each(collection.models, function(model) {
          // console.log(model.toJSON());
        // });
      },
      failure: function() {
        console.log('FAIL');
      }
    });
  },
  render: function() { }      
});

// ############ APP ############

myCollection = new UserCollection();

var App = new AppView();
