// This stores the position of the current item being dragged
const position = { x: 0, y: 0 };
// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    //inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
		/*interact.modifiers.snapEdges({
			targets: [
				interact.createSnapGrid({ top: 100, left: 100 })
			]
		}),*/
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
		// keep the edges inside the parent
		interact.modifiers.restrictEdges({
			outer: 'parent'
		}),

		// minimum size
		interact.modifiers.restrictSize({
			min: { width: 100, height: 50 }
		})
	],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,
    }
})
.resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
      }
    },
    modifiers: [
		/*interact.modifiers.snapEdges({
			targets: [
				interact.createSnapGrid({ top: 100, left: 100 })
			]
		}),*/
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
		// keep the edges inside the parent
		interact.modifiers.restrictEdges({
			outer: 'parent'
		}),

		// minimum size
		interact.modifiers.restrictSize({
			min: { width: 100, height: 50 }
		}),
      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],
})

//============================================
//******************DROPZONE******************
//============================================

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
	// only accept elements matching this CSS selector
	//accept: '#yes-drop',
	// Require a 75% element overlap for a drop to be possible
	overlap: 1,

	// listen for drop related events:

	ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active')
		event.relatedTarget.classList.add('dragging')
	},
	ondragenter: function (event) {
		var draggableElement = event.relatedTarget
		var dropzoneElement = event.target

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target')
		draggableElement.classList.add('can-drop')
	},
	ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target')
		event.relatedTarget.classList.remove('can-drop')
	},
	ondrop: function (event) {
	},
	ondropdeactivate: function (event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
	}
})

interact('.dropzoneDelete').dropzone({
	overlap: 0.001,
	
	ondrop: function (event) {
		event.relatedTarget.remove()
	}
})
 
//============================================
//****************END DROPZONE****************
//============================================

/*function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}*/

function dragMoveListener (event) {
	const { currentTarget, interaction } = event;
	var element = currentTarget;

	// If we are dragging an item from the sidebar, its transform value will be ''
	// We need to clone it, and then start moving the clone
	if (
		interaction.pointerIsDown &&
		!interaction.interacting() &&
		currentTarget.style.transform === ""
	) {
		element = currentTarget.cloneNode(true);

		// Add absolute positioning so that cloned object lives right on top of the original object
		element.style.position = "absolute";
		element.style.left = 0;
		element.style.top = 0;

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
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener