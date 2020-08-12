//============================================
//*************DRAG MOVE LISTENER*************
//============================================

// This stores the position of the current item being dragged
const position = { x: 0, y: 0 };

function dragMoveListener (event) {
	position.x += event.dx;
    position.y += event.dy;

	event.target.style.webkitTransform = event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

//============================================
//***********END DRAG MOVE LISTENER***********
//============================================



//============================================
//**************DRAGGABLE TOOL****************
//============================================

interact(".draggableTool")
.draggable({
	//inertia: true,
	modifiers: [
		// Snapping
		/*interact.modifiers.snap({
			targets: [
				interact.createSnapGrid({ x: 30, y: 30 })
			],
			range: Infinity,
			relativePoints: [ { x: 0, y: 0 } ]
		}),*/
		interact.modifiers.restrict({
			endOnly: true
		}),
		// Minimum size
		interact.modifiers.restrictSize({
			min: { width: 100, height: 50 }
		})
	],  
	// By setting manualStart to true - we control the manualStart.
	// We need to do this so that we can clone the object before we begin dragging it.
	//manualStart: true,
	listeners: { move: window.dragMoveListener }
	/*listeners: {
      move(event) {
        position.x += event.dx;
        position.y += event.dy;
        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }*/
  })
// This only gets called when we trigger it below using interact.start(...)
// Spawn correct placeable on drag
.on("move", function(event) {
	const { currentTarget, interaction } = event;
	var element = currentTarget;

	// If we are dragging an item from the sidebar, its transform value will be ''
	// We need to clone it, and then start moving the clone
	if (
		interaction.pointerIsDown &&
		!interaction.interacting() &&
		currentTarget.style.transform === ""
	) {
		// Clone the placeable version of the chosen tool
		element = document.getElementById(element.id + 'Object').cloneNode(true);
		// Assign it a unique ID
		element.id = element.id + getRandomInt(1000,10000);

		// Add absolute positioning so that cloned object lives right on top of the original object
		element.style.position = "absolute";
		element.style.left = 0;
		element.style.top = 0;
		element.style.visibility = "visible";

		// Add the cloned object to the document
		const container = document.querySelector("#toolbox");
		container && container.appendChild(element);

		const { offsetTop, offsetLeft } = currentTarget;
		position.x = offsetLeft;
		position.y = offsetTop;

		// If we are moving an already existing item, we need to make sure the position object has
		// the correct values before we start dragging it
	} else if (interaction.pointerIsDown && !interaction.interacting()) {
		const regex = /translate\(([\d]+)px, ([\d]+)px\)/i;
		const transform = regex.exec(currentTarget.style.transform);

		if (transform && transform.length > 1) {
			position.x = Number(transform[1]);
			position.y = Number(transform[2]);
		}
	}

	// Start the drag event
	interaction.start({ 
		name: "drag" }, 
		event.interactable, 
		element
	);
})
//============================================
//************END DRAGGABLE TOOL**************
//============================================



//============================================
//*****************DRAGGABLE******************
//============================================

// target elements with the "draggable" class
interact('.draggable')
	.draggable({
		onmove: dragMoveListener2,
		allowFrom: '.handleMove'
	})
	.resizable({
		//allowFrom: '.handleSize',
		edges: { left: false, right: true, bottom: true, top: false }
	})
	.on('resizemove', function (event) {
		const target = event.target;
		target.style.width = event.rect.width + 'px'
		target.style.height = event.rect.height + 'px';
		
	});
	
	
function dragMoveListener2 (event) {
	var style = window.getComputedStyle(event.target);
	var matrix = new WebKitCSSMatrix(style.webkitTransform);
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        //x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        //y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
		x = matrix.m41 + event.dx,
		y = matrix.m42 + event.dy;

	//console.log(matrix);

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
		'translate(' + x + 'px, ' + y + 'px)';
	  
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
//============================================
//***************END DRAGGABLE****************
//============================================



//============================================
//***************DELETE BUTTON****************
//============================================

function deleteItem() {
	if (confirm('Are you sure you want to delete this?')) {
		// Delete item
		event.target.parentNode.remove()
	} else {
	// Do nothing
	}
}
//============================================
//*************END DELETE BUTTON**************
//============================================



//============================================
//******************DROPZONE******************
//============================================

// Enable draggables to be dropped into this
interact('.dropzone').dropzone({
	// Only accept elements matching this CSS selector
		//accept: '#yes-drop',
	// Require a 100% element overlap for a drop to be possible
	overlap: 1,

	// Listen for drop related events:
	ondropactivate: function (event) {
		// Add active dropzone feedback
		event.target.classList.add('drop-active')
		event.relatedTarget.classList.add('dragging')
	},
	ondragenter: function (event) {
		var draggableElement = event.relatedTarget
		var dropzoneElement = event.target

		// Feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target')
		draggableElement.classList.add('can-drop')
	},
	ondragleave: function (event) {
		// Remove the drop feedback style
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	},
	ondrop: function (event) {
	},
	ondropdeactivate: function (event) {
		// Remove active dropzone feedback
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
  }
})

interact('.dropzoneDelete').dropzone({
	overlap: 0.001,
	ondragenter: function (event) {
		document.getElementById('deleteNotice').classList.add('visible');
	},
	ondragleave: function (event) {
		document.getElementById('deleteNotice').classList.remove('visible');
	},
	ondrop: function (event) {
		// Delete object in dropzone
		event.relatedTarget.remove()
		document.getElementById('deleteNotice').classList.remove('visible');
	}
})
 
//============================================
//****************END DROPZONE****************
//============================================


// Randomly generate an integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}