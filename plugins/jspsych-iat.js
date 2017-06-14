/**
 * jspsych-iat
 * Kristin Diep 
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


 jsPsych.plugins["iat"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('iat', 'stimulus', 'image', function(t){return !t.is_html || t.is_html == 'undefined'});

  
  plugin.trial = function(display_element, trial) {

    var plugin_id_name = "jspsych-iat";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }


    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set default values for the parameters
    trial.display_feedback = trial.display_feedback || false;
    trial.image_when_wrong = trial.image_when_wrong || 'undefined';
    trial.wrong_image_name = trial.wrong_image_name || 'wrong image';
    trial.left_category_key = trial.left_category_key || 'E';
    trial.right_category_key = trial.right_category_key || 'I';
    trial.left_category_label = trial.left_category_label || ['left'];
    trial.right_category_label = trial.right_category_label || ['right']; 
    trial.stim_key_association = trial.stim_key_association || 'undefined';
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? true : trial.response_ends_trial;
    trial.timing_response = trial.timing_response || -1;
    trial.key_to_move_forward = trial.key_to_move_forward || [jsPsych.ALL_KEYS];
    trial.prompt = trial.prompt || "";

    //Get keys to continue and put them in a string 
    var i;
    var keysToContinue = "";
    var lastKey = trial.key_to_move_forward.length - 1;
    for(i = 0; i < lastKey; i++) {
      keysToContinue += trial.key_to_move_forward[i] + ", ";
    }
  

    var html_str = " ";
    //html_str += "<div class='main_layout' style='position: relative; height: 100vh; width: 100vh' id='jspsych-iat-stim'>";

    if (!trial.is_html) {
      html_str += "<div style='position: absolute; height: 20%; width: 100%; margin-left: auto; margin-right: auto; top: 42%; left: 0; right: 0'><img src='"+trial.stimulus+"' id='jspsych-iat-stim'></img></div>";
    } else {
      html_str += "<div style='position: absolute; height: 20%; width: 100%; margin-left: auto; margin-right: auto; top: 42%; left: 0; right: 0'><p id='jspsych-iat-stim'>" + trial.stimulus + "</p></div>";
    } 

    html_str += "<div id='trial_left_align' style='position: absolute; top: 18%; left: 20%'>";

    if(trial.left_category_label.length == 1) {
      html_str += "<p>Press " + trial.left_category_key + " for:<br> " + 
      trial.left_category_label[0].bold() + "</p></div>";
    } else {
      html_str += "<p>Press " + trial.left_category_key + " for:<br> " + 
      trial.left_category_label[0].bold() + "<br>" + "or<br>" +
      trial.left_category_label[1].bold() + "</p></div>";
    }
    
    html_str += "<div id='trial_right_align' style='position: absolute; top: 18%; right: 20%'>";

    if(trial.right_category_label.length == 1) {
      html_str += "<p>Press " + trial.right_category_key + " for:<br> " + 
      trial.right_category_label[0].bold() + '</p></div>';
    } else {
      html_str += "<p>Press " + trial.right_category_key + " for:<br> " + 
      trial.right_category_label[0].bold() + "<br>" + "or<br>" + 
      trial.right_category_label[1].bold() + "</p></div>";
    }
    
    html_str += "<div id='wrongImgID' style='position:relative; top: 300px; margin-left: auto; margin-right: auto; left: 0; right: 0'>";

    if(!trial.response_ends_trial && trial.display_feedback == true) {
      html_str += "<div id='wrongImgContainer' style='visibility: hidden; position: absolute; top: -75px; margin-left: auto; margin-right: auto; left: 0; right: 0'><img src='" + trial.image_when_wrong + "' id='wrongImgID'></img></div>";
      var wImg = document.getElementById("wrongImgContainer");
      html_str += "<p>Trial will continue automatically.</p>";
    }

    if(!trial.response_ends_trial && !trial.display_feedback) {
      html_str += "<p>Trial will continue automatically.</p>";
    }

    if(trial.response_ends_trial && trial.display_feedback == true) {
      html_str += "<div id='wrongImgContainer' style='visibility: hidden; position: absolute; top: -75px; margin-left: auto; margin-right: auto; left: 0; right: 0'><img src='" + trial.image_when_wrong + "' id='wrongImgID'></img></div>";
      var wImg = document.getElementById("wrongImgContainer");
      //wImg.style.visibility = "hidden"; 

      if(trial.key_to_move_forward.length == 1) {
        if(trial.key_to_move_forward[0] == "other key") {
          html_str += "<p>If you press the wrong key, a " + trial.wrong_image_name + " will appear. Press the other key to continue.</p>"
        } else if(trial.key_to_move_forward[0] == jsPsych.ALL_KEYS) {
          html_str += "<p>If you press the wrong key, a " + trial.wrong_image_name + " will appear. Press any key to continue.</p>"
        } else {
        html_str += "<p>If you press the wrong key, a " + trial.wrong_image_name + " will appear. Press " + trial.key_to_move_forward[0] + " to continue.</p>";
      }
      } else {
        html_str += "<p>If you press the wrong key, a " + trial.wrong_image_name + " will appear. Press " + 
        keysToContinue + " " + trial.key_to_move_forward[lastKey] + " to continue.</p>";
      }
    } else if (trial.response_ends_trial && trial.display_feedback != true) {
      html_str += "<div id='wrongImgContainer' style='position: absolute; top: -75px; margin-left: auto; margin-right: auto; left: 0; right: 0'></div>";
      if(trial.key_to_move_forward.length == 1) {
        if(trial.key_to_move_forward[0] == "other key") {
          html_str += "<p>If you press the wrong key, press the other key to continue.</p>"
        } else if(trial.key_to_move_forward[0] == jsPsych.ALL_KEYS) {
          html_str += "<p>If you press the wrong key, press any key to continue.</p>"
        } else {
        html_str += "<p>If you press the wrong key, press " + trial.key_to_move_forward[0] + " to continue.</p>";
        }
        } else {
        html_str += "<p>If you press the wrong key, press " + 
        keysToContinue + " " + trial.key_to_move_forward[lastKey] + " to continue.</p>";
      }
    }

    html_str += "</div>";
    
    display_element.innerHTML += html_str;


    //show prompt if there is one
    if (trial.prompt !== "") {
      display_element.innerHTML += trial.prompt;
    }

    // store response
    var response = {
      rt: -1,
      key: -1,
      correct: false
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key,
        "correct": response.correct
      };

      jsPsych.data.write(trial_data);
      jsPsych.data.addDataToLastTrial(trial_data);

      // clears the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };


    var leftKeyCode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.left_category_key); 
    var rightKeyCode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.right_category_key);
    

    // function to handle responses by the subject
    var after_response = function(info) {
      var wImg = document.getElementById("wrongImgContainer");
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-iat-stim').className += ' responded';

      // only record the first response
      if (response.key == -1 ) {
        response = info;
      }
      
      if(trial.stim_key_association == "right") {
        if(response.rt > -1 && response.key == rightKeyCode) {
          response.correct = true;
          if (trial.response_ends_trial) {
            end_trial();
          }
        } else {
          response.correct = false;
          if(!trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
          }
          if (trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
            if(trial.key_to_move_forward[0] == "other key") {
              var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_trial,
                valid_responses: [trial.right_category_key]
              });
            } else {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: trial.key_to_move_forward
            });}
           } else if(trial.response_ends_trial && trial.display_feedback != true) {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: [jsPsych.ALL_KEYS]
            });
          } else if(!trial.response_ends_trial && trial.display_feedback != true) {
            // end_trial();
          }
        }
      } else if(trial.stim_key_association == "left") {
        if(response.rt > -1 && response.key == leftKeyCode) {
          response.correct = true;
          if (trial.response_ends_trial) {
            end_trial();
          }
        } else {
          response.correct = false;
          if(!trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
          }
          if (trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
            if(trial.key_to_move_forward[0] == "other key") {
              var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_trial,
                valid_responses: [trial.left_category_key]
              });
            } else {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: trial.key_to_move_forward
            });}
          } else if(trial.response_ends_trial && trial.display_feedback != true) {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: [jsPsych.ALL_KEYS]
            });
          } else if(!trial.response_ends_trial && trial.display_feedback != true) {
            // end_trial();
          }
        }
      } 
    };

    // start the response listener
    if (trial.left_category_key != jsPsych.NO_KEYS && trial.right_category_key != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.left_category_key, trial.right_category_key],
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }
    

    // end trial if time limit is set
    if (trial.timing_response > 0 && trial.response_ends_trial != true) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.timing_response);
    } 

  };

  return plugin;
})();
