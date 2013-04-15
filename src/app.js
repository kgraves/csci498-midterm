$(document).ready( function() {

  // ############ DB HELPER STUFF ############
  var db = SQLite({ shortName: 'github' });

  var dbSchema = {
    schemaString: 'id INTEGER PRIMARY KEY, ' + 'login TEXT, ' + 'url TEXT'
  };

  /*
  var dbSchema = {
    schemaString: 'avatar_url TEXT, ' +
      'events_url TEXT, ' +
      'followers_url TEXT, ' +
      'following_url TEXT, ' +
      'gists_url TEXT, ' +
      'gravatar_id TEXT, ' +
      'html_url TEXT, ' +
      'id INTEGER PRIMARY KEY, ' +
      'login TEXT, ' +
      'organizations_url TEXT, ' +
      'received_events_url TEXT, ' +
      'repos_url TEXT, ' +
      'starred_url TEXT, ' +
      'subscriptions_url TEXT, ' +
      'type TEXT, ' +
      'url TEXT'
  };
  */

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

    initialize: function() {
      _.bindAll(this, 'render');

      this.collection = new UserCollection();

      // initial data fetch
      this.collection.fetch({
        success: function(collection, response){
          // insert models into db
          _.each(collection.models, function(model) {
            db.insert('users', {id: model.attributes.id, 
                                login: model.attributes.login, 
                                url: model.attributes.url});
          });

          // initial render
          App.render();
        },
        failure: function() {
          console.log('FAIL');
        }
      });
    },

    render: function() {
      // select all users
      db.select('users', '*', null, null, function(results) {
        for(x=0; x<results.rows.length; x++) {
          model = new User(results.rows.item(x));
          App.collection.push(model);

          // render model to ui
          $('#main_content').append('<tr id="model">' +
                                      '<td>' + model.attributes.id + '</td>' +
                                      '<td>' + model.attributes.login + '</td>' +
                                      '<td>' + model.attributes.url + '</td>' +
                                    '</tr>');
        };
      });

      /*
      _.each(this.collection.models, function(model) {

        // render model to ui
        $('#main_content').append('<tr id="model">' +
                                    '<td>' + model.attributes.id + '</td>' +
                                    '<td>' + model.attributes.login + '</td>' +
                                    '<td>' + model.attributes.url + '</td>' +
                                  '</tr>');
      });
      */

      return this;
    }      
  });

  // ############ APP ############

  // form submit handler
  //    creates a new user model and 
  //    adds it to the App
  $('#user_form').submit( function() {
    user_login = $('#user_login').val();
    user_url = $('#user_url').val();

    // insert and render ui
    db.insert('users', {login: user_login, url: user_url});
    App.render();

    // clear ui elements
    $('#user_login').val('');
    $('#user_url').val('');

    return false;
  });

  // try dropping then creating table
  db.dropTable('users');
  db.createTable('users', dbSchema.schemaString);

  var App = new AppView({el: $('#main_content')});

});
