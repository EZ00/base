(function($) {

	Page = {
		isMobile: function() {
			// return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera);
			return $(window).width() <= 768;
		},
		Toggle: {
			init: function(element) {
				var $element = $(element);
				var $child = $($element.data("target"));

				if ($child.hasClass("in")) {
					$element.find(".toggle-open").show();
					$element.find(".toggle-closed").hide();
				} else {
					$element.find(".toggle-closed").show();
					$element.find(".toggle-open").hide();
				}
			},

			update: function(element) {
				var $element = $(element);
				if ($element.find(".toggle-closed").is(":visible")) {
					$element.find(".toggle-open").show();
					$element.find(".toggle-closed").hide();
				} else {
					$element.find(".toggle-closed").show();
					$element.find(".toggle-open").hide();
				}
			}
		}
	};

	// toggle
	$(".toggle").each(function(i, element) {
		Page.Toggle.init(element);
	});
	$(".toggle").click(function(event) {
		Page.Toggle.update($(event.target).parent()[0]);
	});

	// stackscript search
	$(".ss-distro-li").click(function(event) {
		var distro = $(event.target).text();

		if (distro === "All distros")
			$("#ss_vendor").val("");
		else
			$("#ss_vendor").val(distro);

		$("#ss-search").submit();
	});

	// activate syntax hilighting
	$.browser = { safari: null };
	$.SyntaxHighlighter.loadedExtras = true; // extras are built in
	$.SyntaxHighlighter.init({
		'load': false,
		'alternateLines': true,
		'theme': 'linode',
		'wrapLines': true
	});

	// outbound links
	$("a").on('click',function(e){
		var url = $(this).attr("href");
		if (e.currentTarget.host != window.location.host) {
			_gaq.push(['_trackEvent', 'Outbound Links', e.currentTarget.host, url, 0]);
		}
	});

	// print button
	$(".js-print").click(function(event) {
		window.print();
		event.preventDefault();
	});

	// lightbox
	$( ".lightbox" ).each(function () {
		$( this ).parent().bind('click', false);
		$( this ).on('click', function(e) {
			var image_title = $( this ).attr('alt');
			var image_href = $( this ).parent().attr('href') || $( this ).attr('src');
			$( '#img-modal-image' ).attr('src', image_href);
			$( '#img-modal-title' ).text(image_title);
			$( '#img-modal' ).modal({ show: true });
		});
	});

	// ps form
	$('[data-toggle="checkbox"]').change(function (e) {
		$(this).siblings('input:checkbox, input:radio').prop('checked', $(this).val());
	});

	$('[data-toggle="other-field"]').click(function (e) {
		e.preventDefault();

		var length = $(this).parent().find('.input-group').length;
		var name = $(this).data('name');
		var id = name + '-other-' + length;

		var other_field = $($(this).data('target')).clone();
		other_field.removeAttr('id');
		other_field.find('input:checkbox')
			.attr('id', id);
		other_field.find('label')
			.attr('for', id);
		other_field.find('input:text, select')
			.attr('id', id + '-option')
			.attr('name', name)
			.attr('required', "");

		other_field.find('input:text, select').change(function (e) {
			if ($(this).val())
				$(this).siblings('input:checkbox, input:radio').prop('checked', true);
			else
				$(this).parent().remove();
		});

		other_field.find('input:checkbox').click(function(e) {
			if (!$(this).prop('checked'))
				$(this).parent().remove();
		});

		$(this).before(other_field);
	});

	$('#no-ticket').click(function (e) {
		e.preventDefault();

		var elem = $('#ticket-number');
		if (elem.attr('name') == 'ticket_number') {
			elem.attr('name', 'email_address')
				.attr('placeholder', 'Email Address')
				.attr('aria-label', 'Email Address')
				.attr('type', 'email');
			$(this).text('have a ticket?');
		}
		else {
			elem.attr('name', 'ticket_number')
				.attr('placeholder', 'Ticket Number')
				.attr('aria-label', 'Ticket Number')
				.attr('type', 'number');
			$(this).text('no ticket?');
		}
	});
})(jQuery);
