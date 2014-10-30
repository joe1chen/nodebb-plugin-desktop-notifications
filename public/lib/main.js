(function() {
	"use strict";

	function requestPermission() {
		require(['notify'], function(Notify) {
			(new Notify('NodeBB')).requestPermission();
		});
	}

	jQuery('document').ready(function() {
		var logo = $('.forum-logo').attr('src');

		requestPermission();

		jQuery('#notif_dropdown').on('click', function() {
			requestPermission();
		});

		jQuery('*').on('click', function() {
			requestPermission();
		});
		
		socket.on('event:new_notification', function(data) {
			if (!data) {
				return;
			}
			var text = data.bodyShort || data.text;
			if (!text) {
				return;
			}
			translator.translate(text, function(translated) {
				require(['notify'], function(Notify) {
					var notification = new Notify(config.siteTitle, {
						body: translated.replace(/<strong>/g, '').replace(/<\/strong>/g, ''),
						icon: logo,
						notifyClick: function() {
							if (data.path) {
								ajaxify.go(data.path.substring(1));
							}
						},
						timeout: 10
					});
					notification.show();
				});
			});
		});
	});
}());
