stories = new Meteor.Collection("stories")
Meteor.subscribe("stories")		// TODO rate limit

Meteor.Router.add({
	"/:id": function(id) {
		Session.set("storyid", id)
	}
})

Template.path.story = function() {
	var storyid = Session.get("storyid")
	if(storyid == undefined) {
		storyid = "0"
	}
	var story = stories.findOne({_id: storyid})
	if(!story)
		return []
	var complete = [story]
	while(story && story.parent) {
		var last = story._id
		story = stories.findOne({_id: story.parent})
		story.paths.forEach(function(s) {
			s.followed = s._story == last
		})
		complete.push(story)
	}
	complete.reverse()
	return complete
}

Template.story.events({
	"submit .create": function(e, t) {
		e.preventDefault()
		var id = stories.insert({
			body: t.find(".body").value,
			parent: this._id,
			creator: Meteor.userId(),
		})
		stories.update(this._id, {$push: {paths: {_story: id, path: t.find(".choice").value}}})
		Meteor.Router.to("/" + id)
	},
	"click .showcreate": function(e, t) {
		$(t.find(".create")).toggle()
	}
})