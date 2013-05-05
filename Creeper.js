!function(){

	function Creeper( options ){
		for( var i in options ) {
			this[i] = options[i]
		}
		this.id = '_' + Math.round( Math.random() * 100000 ).toString(16);
		this.setAnimation( world.SPRITE_CREEPER_WALK );
		this.vx = 1 * this.direction;
	}

	Creeper.prototype = {};

	world.extend(Creeper.prototype, world.Entity.prototype);
	world.extend(Creeper.prototype, {
		w : 6,
		h : 8,

		vy : 1,

		vx : 1,

		_grounding : false,
		
		_grounded  : false,

		direction  : 1,

		max_speed : 1,

		weight : 0.1,

		frame_steps : 3,

		boundaries : [ 0, 10, -4, -10 ],

		collection : 'creepers',

		attack : function(){
			world.base_hp -= world.CREEPER_ATTACK_DAMAGE;
			world.damageBase();
			this.setAnimation( world.SPRITE_CREEPER_ATTACK );
		},

		kill : function(){
			world.killed_creepers++;
			world.updateKillsGUI();
			delete world.creepers[ this.id ];
		},


		outOfBoundaries : function(){
			// Probably the creeper now takes a bath in lava...
	
			var size = world.resources[ world.SPRITE_DAMAGE_16 ].height;

			var explosion = new world.Explosion({
				x            : this.x,
				y            : world.G_HEIGHT - 4,
				sprite       : world.SPRITE_DAMAGE_16,
				w            : size,
				h            : size,
				draw_shift_x : -size/2,
				draw_shift_y : -size/2,
				quake        : false
			});

			world.explosions[ explosion.id ] = explosion;
			
			this.kill();
			world.creepers_in_lava++
		},

		groundify : function(){
			if ( this._grounding ) {
				return;
			}
			
			this._grounding = true;

			var self = this;
			var ctx = world.layers[ world.LAYER_GROUND ];

			var sprite_canvas = world.resources[ world.SPRITE_CREEPER_GROUNDIFY ];
			var max_frames = Math.round( sprite_canvas.width / this.w );

			function _blit(){
				ctx.drawImage( sprite_canvas, (max_frames-1) * self.w  , 0, self.w, self.h, self.x, self.y, self.w, self.h );
			}

			world.updateCollisionLayer( 'rect', 0, Math.round(self.x), Math.ceil(self.y) + 5, Math.round(self.w), 4, 1 );

			this.setAnimation( world.SPRITE_CREEPER_GROUNDIFY, 'once', function(){
				_blit();
				self._grounded = true;
				delete world.creepers[ self.id ];
			});
		},

		getCollision : function(x, y){
			if ( this.y < 0 ) {
				return 0;
			}

			var x = Math.round( this.x ),
				y = Math.round( this.y );

			var t_data   = world.getCollisionPixels( x - 1      , y          , this.w + 2 , 3 ),
				r_data   = world.getCollisionPixels( x - 1      , y + 3      , 1          , 5 ),
				b_data   = world.getCollisionPixels( x - 1      , y + this.h , this.w + 2 , 1 ),
				l_data   = world.getCollisionPixels( x + this.w , y + 3      , 1          , 5 ),
				t_count  = 0, b_count = 0,
				l_count  = 0, r_count = 0;
			
			for( var i = 0; i <= t_data.length - 1; i ++ ) {
				if ( t_data[i] != 0 ) t_count++;
			}
			
			for( var i = 0; i <= r_data.length - 1; i ++ ) {
				if ( r_data[i] != 0 ) r_count++;
			}
			
			for( var i = 0; i <= b_data.length - 1; i ++ ) {
				if ( b_data[i] != 0 ) b_count++;
			}

			for( var i = 0; i <= l_data.length - 1; i ++ ) {
				if ( l_data[i] != 0 ) l_count++;
			}

			return {
				right      : r_data.reverse().join('').substr(0,4) == '1111',
				left       : l_data.reverse().join('').substr(0,4)  == '1111',
				bottom     : !!b_count,
				top        : !!t_count,
				t_count    : t_count,
				r_count    : r_count,
				b_count    : b_count,
				l_count    : l_count,
				y          : this.y + this.h
			};
		},

		step: function(){
			if ( this._grounded ) {
				return;
			}

			if ( Math.abs(this.vy) >= this.max_speed ) {
				this.vy = this.max_speed;
			}
			
			if ( Math.abs(this.vx) >= this.max_speed ) {
				this.vx = this.max_speed * this.direction;
			}

			this.vy += world.GRAVITATION * this.weight;

			this.px = this.x;
			this.py = this.y;

			var collision = this.getCollision();

			if ( ( collision.right && collision.r_count > world.CREEPER_HORIZ_COLLIDE ) || collision.top ){
				this.groundify();

			} else {
				this.y -= collision.r_count || collision.l_count;

				if ( collision.bottom || collision.right ) {
					this.x += this.vx;
				} 

				if ( !collision.bottom ) {
					this.y += this.vy;
				}
			}

			var base_collision = this.getBaseCollision();

			if ( base_collision.collide ) {
				this.vx = 0;
				this.attack();
			}

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			if ( world.steps % this.frame_steps == 0 ) {
				this.nextFrame();
			}

			this.checkBoundaries();
		},

		getBaseCollision : function(){
			var collide = false;

			if ( this.direction > 0 && this.x + this.w >= world.BASE_X ){//|| this.x <= world.BASE_X + world.resources[ world.SPRITE_BASE_00 ].width ) {
				collide = true;
			} else if ( this.direction < 0 && this.x <= world.BASE_X + world.resources[ world.SPRITE_BASE_00 ].width ) {
				collide = true;
			}

			return {
				collide : collide
			}
		}
	});

	world.Creeper = Creeper;

}();
