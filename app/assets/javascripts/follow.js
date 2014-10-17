$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;
  this.url = this.$el.closest("form").attr("action") || options.url;
  this.render();
  var that = this;
  this.$el.on("click", function(event) {
    that.handleClick(event);
  });
};

$.FollowToggle.prototype.render = function() {
  if (this.followState === 'followed') {
    this.$el.html("Unfollow!");
  } else if (this.followState === 'unfollowed') {
    this.$el.html("Follow!");
  }
};

$.FollowToggle.prototype.handleClick = function(event) {
  event.preventDefault();

  this.$el.prop("disabled", true);
  // var url = this.$el.closest("form").attr("action");
  var type;
  var that = this;

  if ( this.followState === 'followed' ) {
    type = "DELETE";
    this.followState = "unfollowing";
  } else {
    type = "POST";
    this.followState = "following";
  }

  $.ajax({
    dataType: 'json',
    url: that.url,
    type: type,
    success: function(data) {
      that.toggleFollowState();
      that.$el.data("follow-state", that.followState);
      that.render();
      that.$el.prop("disabled", false);
    }
  });
};

$.FollowToggle.prototype.toggleFollowState = function () {
  if(this.followState === "unfollowing") {
    this.followState = "unfollowed";
  } else if (this.followState === "following") {
    this.followState = "followed";
  }
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});