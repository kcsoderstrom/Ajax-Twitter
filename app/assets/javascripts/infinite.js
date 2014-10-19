$.InfiniteTweets = function(el) {
  this.$el = $(el);
  this.maxCreatedAt = null;
  var that = this;
  this.fetchTweets(new Event("refreshing"));
  this.$el.on("click", function(event){
    that.fetchTweets(event);
  });
}

$.InfiniteTweets.prototype.fetchTweets = function (event) {
  event.preventDefault();
  var params = {};
  if (this.maxCreatedAt != null) {
    params.max_created_at = this.maxCreatedAt;
  }
  var that = this;

  $.ajax({
    type: "GET",
    url: "/feed",
    dataType: 'json',
    data: params,
    success: function(data) {
      that.insertTweets(data);
      that.maxCreatedAt = data[data.length - 1].created_at;

      if(data.length < 20) {
        that.$el.find('a.fetch-more').empty();
      }
    }
  });
};

$.InfiniteTweets.prototype.insertTweets = function (data) {
  var that = this;
  data.forEach( function(datum){
    that.$el.find('ul.tweet-list').append(_.template('<li><%= content %></li>')(datum));
    // the formatting here is badder than usual.
  });
};

$.fn.infiniteTweets = function () {
  return this.each(function () {
    new $.InfiniteTweets(this);
  });
};

$(function () {
  $(".infinite-tweets").infiniteTweets();
});

