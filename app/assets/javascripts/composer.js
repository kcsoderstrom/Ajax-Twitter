$.TweetCompose = function(el) {
  this.$el = $(el);
  var that = this;
  this.$el.on("submit", function(event) {
    that.handleSubmit(event);
  });
  this.$el.on("click", "a.add-mentioned-user", function(event) {
    that.addMentionedUser(event);
  });
  this.$el.on("click", "a.remove-mentioned-user", function(event){
    that.removeMentionedUser(event);
  });
};

$.TweetCompose.prototype.removeMentionedUser = function (event) {
  event.preventDefault();
  var $parentBox = $(event.currentTarget).closest(".mention-box");
  $parentBox.remove();
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
  for (var i = 0; i < mentions.length; i++) {
    var foo = $(mentions[i]).val();
    data.mentioned_user_ids.push(foo);
  }
  var $list = $('.tweet-list');

  $.ajax({
    type: "POST",
    url: url,
    data: { tweet: data },
    dataType: 'JSON',
    success: function(data) {
      var newentry = that.makeTemplate(data);
      $list.prepend(newentry);
      that.clearInput();
    }
  });
};

$.TweetCompose.prototype.clearInput = function () {
  this.$el.find("ul.mentioned-users").empty();
  this.$el.find(".tweet-content").val("");
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