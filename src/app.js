$(document).ready( function() {

  // ############ DB HELPER STUFF ############
  var db = SQLite({ shortName: 'github' });

  var dbSchema = {
    schemaString: 'id INTEGER PRIMARY KEY, ' + 'login TEXT, ' + 'url TEXT'
  };

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

            $('#users_tbody').append('<tr id="model">' +
                                        '<td>' + model.attributes.id + '</td>' +
                                        '<td>' + model.attributes.login + '</td>' +
                                        '<td>' + model.attributes.url + '</td>' +
                                        '<td id="destroy"><p>Destroy</p></td>' +
                                     '</tr>');
          });

          // initial render
          // App.render();
        },
        failure: function() {
        }
      });
    },

    render: function() {

      // select all users
      db.select('users', '*', null, null, function(results) {

        // clear tbody
        $('#users_tbody tr').each( function() {
          $(this).remove();
        });

        for(x=0; x<results.rows.length; x++) {
          model = new User(results.rows.item(x));
          App.collection.push(model);

          $('#users_tbody').append('<tr id="model">' +
                                      '<td>' + model.attributes.id + '</td>' +
                                      '<td>' + model.attributes.login + '</td>' +
                                      '<td>' + model.attributes.url + '</td>' +
                                      '<td id="destroy"><p>Destroy</p></td>' +
                                   '</tr>');
        };

      });

      return this;
    }      
  });

  // ############ UTILS ############

  // form submit handler
  $('#user_form').submit( function() {
    user_id = $('#user_id').val();
    user_login = $('#user_login').val();
    user_url = $('#user_url').val();

    // hidden field data determines whether update or insert
    if (user_id == "") {
      db.insert('users', {login: user_login, url: user_url});
    }
    else {
      db.update('users', {login: user_login, url: user_url}, {id: user_id});
    }

    App.render();

    // clear ui elements
    $('#user_id').val('');
    $('#user_login').val('');
    $('#user_url').val('');

    return false;
  });

  // click handler for table row tags
  $(document).on("click", '#model', function() {
    // populate user form fields
    $('#user_id').val( $(this).context.cells[0].textContent );
    $('#user_login').val( $(this).context.cells[1].textContent );
    $('#user_url').val( $(this).context.cells[2].textContent );
  });

  // click handler for remove paragraph tags
  $(document).on("dblclick", '#destroy', function() {
    user_id = $(this).parent('tr').get(0).cells[0].textContent;

    db.destroy('users', {id: user_id});
    $(this).parent().remove();

    // clear ui elements
    $('#user_id').val('');
    $('#user_login').val('');
    $('#user_url').val('');
  });

  // ############ APP ############

  // try dropping then creating table
  db.dropTable('users');
  db.createTable('users', dbSchema.schemaString);

  var App = new AppView({el: $('#users_tbody')});

});
