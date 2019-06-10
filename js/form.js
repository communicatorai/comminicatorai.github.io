      $(function(){
    $('#contactModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    })

      $('#contactForm').submit(function() {
	  var name = $("#name").val();
	  var email = $("#email").val();
	  var message = $("#message").val();
	  if(name.trim() === ""){ alert("Please enter your name");return false; }
	  if(email.trim() === ""){ alert("Please enter your email");return false;}
	  if(message.trim() === ""){ alert("Please enter your message");return false;}
	  return true;
      });
      });
