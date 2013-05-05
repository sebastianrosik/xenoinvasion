!function(){
	function Entity(){
		this.id = '_' + Math.round( Math.random() * 100000 ).toString(16);
	}

	Entity.prototype = {
		step : function(){
			if ( Math.abs(this.vy) >= this.max_speed ) {
				this.vy = this.max_speed;
			}
			
			if ( Math.abs(this.vx) >= this.max_speed ) {
				this.vx = this.max_speed * this.direction;
			}

			this.vy += world.GRAVITATION * this.weight;

			this.px = this.x;
			this.py = this.y;

			this.y  += this.vy;
			this.x  += this.vx;

			this.nextFrame();

			this.checkBoundaries();
		},

		checkBoundaries : function(){
			if ( this.x < this.boundaries[3] || 
				 this.y < this.boundaries[0] || 
				 this.x >= world.G_WIDTH  + this.boundaries[1] || 
				 this.y >= world.G_HEIGHT + this.boundaries[2] ){
				
				if ( world[ this.collection ] ) {
					this.outOfBoundaries();
				}
			}
		},

		outOfBoundaries: function(){
			delete world[ this.collection ][ this.id ];
		},

		boundaries : [ -100, 100, 100, -100 ],

		collection : 'entities',

		frame_steps : 1,

		px : 0,
		py : 0,

		x : 0,
		y : 0,

		draw_shift_x : 0,
		draw_shift_y : 0,

		w : 0,
		h : 0,

		vy : 0,
		vx : 0,

		weight : 0,

		current_animation : null,

		current_animation_mode : 'loop',

		current_frame : 0,

		max_frames : 0,

		alredy_played_once : false,

		max_speed  : 0,

		direction : 1,

		animation_end_when_once_callback : function(){},

		setAnimation : function( name, mode, once_callback ) {
			var self = this;

			this.current_frame      = 0;
			this.alredy_played_once = false;
			this.current_animation  = name;
		 	this.max_frames         = Math.round(world.resources[ this.current_animation ].width / this.w);
		 	
		 	this.current_animation_mode = mode || 'loop';

		 	if ( once_callback ) {
			 	this.animation_end_when_once_callback = function(){
			 		self.alredy_played_once = true;
			 		once_callback();
		 		}
		 	}
		},

		nextFrame : function(){
			if ( this.current_frame >= this.max_frames - 1 && this.current_animation_mode == 'once' ) {
				this.animation_end_when_once_callback();
				return;
			}

			if ( this.alredy_played_once ) return;

			this.current_frame++;

			if ( this.current_frame >= this.max_frames ) {
				this.current_frame = 0;
			}
		},


		draw : function(){
			var ctx = world.layers[ world.LAYER_ENTITIES ];
			var sprite_canvas = world[ this.direction > 0 ? 'resources' : 'mirror_resources' ][ this.current_animation ];

			var frame = this.direction > 0 ? this.w * this.current_frame : (this.max_frames - this.current_frame - 1) * this.w;

			ctx.drawImage(
				sprite_canvas, 
				frame , 0, 
				this.w, this.h, 
				this.x + this.draw_shift_x, this.y + this.draw_shift_y, 
				this.w, this.h
			);
		},

		getPixel : function(i, data){
			return [
				data.data[ i ],
				data.data[ i + 1 ],
				data.data[ i + 2 ],
				data.data[ i + 3 ]
			]
		},

		isCollidingPixel : function( pixel ) {
			return pixel[3] != 0;
		}
	}

	world.Entity = Entity;
}()