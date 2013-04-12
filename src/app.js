// ############ DB HELPER STUFF ############
//var db = new ydn.db.Storage('github', schema);
var db = SQLite({ shortName: 'github' });

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

// try creating table
// TODO add table lookup functionality to sqlite.js
try {
  db.createTable('users', dbSchema.schemaString);
}
catch (e) {
  console.log('table exists');
}

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
        el = $('#main_content');

        _.each(collection.models, function(model) {
          // insert data into local db
          db.insert('users', model.attributes);

          // append to html
          el.after('<p>' + model.attributes.login + '</p>');
        });
      },
      failure: function() {
        console.log('FAIL');
      }
    });
  },
  render: function() {
    // buffer = '';
    // compiled = _.template("<p>hello: <%= name %></p>");

    // _.each(collection.models, function(model) {
      // buffer += model.attributes.id;
    // });

    // this.$el.html( compiled({name: 'kyle'}) );
  }      
});

// ############ APP ############

myCollection = new UserCollection();

var App = new AppView();

