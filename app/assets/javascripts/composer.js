$.TweetCompose = function(el) {
  this.$el = $(el);
  var that = this;
  this.$el.on("submit", function(event) {
    that.handleSubmit(event);
  });
  this.$el.on("click", "a.add-mentioned-user", function(event) {
    that.addMentionedUser(event);
  });
};

$.TweetCompose.prototype.handleSubmit = function (event) {
  event.preventDefault();
  var that = this;
  var $form = $(event.currentTarget);
  var content = $form.find(".tweet-content").val();
  // console.log($form.find(".tweet-mention"));
  var mentions = $form.find(".tweet-mention");
  var url = $form.attr("action");
  var data = { content: content, mentioned_user_ids: [] };
  console.log(data);
  for (var i = 0; i < mentions.length; i++) {
    var foo = $(mentions[i]).val();
    console.log(foo);
    data.mentioned_user_ids.push(foo);
  }
  console.log(data);
  var $list = $('.tweet-list');

  $.ajax({
    type: "POST",
    url: url,
    data: { tweet: data },
    dataType: 'JSON',
    success: function(data) {
      console.log(that.makeTemplate(data));
      var newentry = that.makeTemplate(data);
      $list.prepend(newentry);
    }
  });
};

$.TweetCompose.prototype.addMentionedUser = function (event) {
  event.preventDefault();
  $scriptTag = this.$el.find(".mention-menu");
  this.$el.find("ul.mentioned-users").append($scriptTag.html());
};


$.TweetCompose.prototype.makeTemplate = function (data) {
  var templateStr = '<li><%= content %> -- <a href="/users/<%= user_id %>"><%= user.username %></a> -- <%= updated_at %>';
  // console.log(data.mentions.length);
  if(data.mentions.length > 0) {
    templateStr += "<ul>";
    for(var i = 0; i < data.mentions.length; i++) {
      templateStr += '<li><a href="users/<%= mentions[' + i + '].user.id %>"><%= mentions[' + i + '].user.username %></a></li>';
    }
    templateStr += "</ul>";
  }
  templateStr += "</li>";
  return _.template(templateStr)(data);
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};

$(function () {
  $("form.tweet-compose").tweetCompose();
});