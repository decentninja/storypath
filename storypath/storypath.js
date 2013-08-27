stories = new Meteor.Collection("stories")

if (Meteor.isClient) {
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
        var complete = [story]
        while(story && story.parent) {
            story = stories.findOne({_id: story.parent})
            complete.push(story)
        }
        complete.reverse()
        return complete
    }
}

if (Meteor.isServer) {
	Meteor.startup(function () {
        if (stories.find().count() === 0) {
            var sampledata = [
                {
                    "_id": "0",
                    "body": "Ones upon a time there was a ",
                    "paths": [
                    {
                        "path": "Lorem ipsum",
                        "_story": 1
                    }
                    ]
                },
                {
                    "_id": "1",
                    "parent": "0",
                    "body": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
                    "paths": [
                    {
                        "path": "Ut wisi",
                        "_story": 2
                    },
                    {
                        "path": "Nam liber",
                        "_story": 3
                    }
                    ]
                },
                {
                    "_id": "2",
                    "parent": "1",
                    "body": "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.",
                    "paths": []
                },
                {
                    "_id": "3",
                    "parent": "1",
                    "body": "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius.",
                    "paths": [
                    {
                        "path": "Claritas",
                        "_story": "4"
                    }
                    ]
                },
                {
                    "_id": "4",
                    "parent": "3",
                    "body": "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.",
                    "paths": []
                }
            ]
            sampledata.forEach(function(o) {
                stories.insert(o)
            })
        }
    })
}
