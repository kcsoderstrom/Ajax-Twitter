$.UserSearch = function(el) {
  this.$el = $(el);
  this.$input = this.$el.find("input");
  this.$ul = this.$el.find("ul");
  this.url = this.$el.data("url");
  this.template = _.template('<li><a href="/users/<%= id %>"><%= username %></a><button class="follow-toggle" data-user-id=<%= id %> data-initial-follow-state=<%= followed ? "followed" : "unfollowed"%>></button></li>');
  var that = this;
  this.$el.on("keyup", "input", function(event) {
    that.handleInput(event);
  });
}

$.UserSearch.prototype.handleInput = function (event) {
  var $input = $(event.currentTarget);
  var matchData = $input.val();
  var that = this;

  console.log();
  $.ajax ({
    dataType: 'json',
    type: "GET",
    url: this.url,
    data: { query: matchData },
    success: function(data) {
      that.render(data);
    }
  });
};

$.UserSearch.prototype.render = function (data) {
  var that = this;
  var $ul = that.$el.find(".users");
  $ul.empty();

  data.forEach( function(datum) {
    $ul.append(that.template(datum));
    $ul.find("button").followToggle({url: '/users/' + datum.id + '/follow'});
  });
};

$.fn.userSearch = function () {
  return this.each(function () {
    new $.UserSearch(this);
  });
};

$(function () {
  $(".users-search").userSearch();
});

