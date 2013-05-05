!function(){

	function Bullet( options ){
		for( var i in options ) {
			this[i] = options[i]
		}
		this.id = '_' + Math.round( Math.random() * 100000 ).toString(16);
		this.setAnimation( world.SPRITE_BULLET );
	}

	Bullet.prototype = {};

	world.extend(Bullet.prototype, world.Entity.prototype);
	world.extend(Bullet.prototype, {
		w : 8,

		h : 8,

		draw_shift_x : -4,

		draw_shift_y : -4,
		
		weight : 0.2,

		max_speed : 100,

		collection : 'bullets',

		boundaries : [ -10000, 100, -4, -100 ],

		outOfBoundaries : function(){
			if ( this.y >= world.G_HEIGHT + this.boundaries[2] ) {
				// Release the CRACKEN! ...I mean lava...
				world.releaseLava();
				var damage = 64; 
				var size   = world.resources[ world['SPRITE_DAMAGE_' + damage ] ].height;

				var clipped = world.clip( this.x, this.y, size, size );

				var explosion = new world.Explosion({
					x            : clipped.x,
					y            : world.G_HEIGHT,
					sprite       : world['SPRITE_DAMAGE_' + damage],
					w            : size,
					h            : size,
					draw_shift_x : -size/2,
					draw_shift_y : -size/2
				});

				world.explosions[ explosion.id ] = explosion;
			}
			
			delete world.bullets[ this.id ];
		},

		step : function(){
			world.Entity.prototype.step.call(this);
			if ( this.getCreeperCollision() || this.getGroundCollision() ) {
				this.explode();
			} else if ( this.getLavaCollision() ) {
				this.explode( 64, true );

			} else {
				switch( this.type ) {
					case world.WEAPON_CARPET: 
						if ( world.steps % 8 == 0 ) {
							var bullet = new Bullet({
								x  : this.x,
								y  : this.y,
								vx : 0,
								vy : 5
							})
							world.bullets[ bullet.id ] = bullet;
						}
						break;
					case world.WEAPON_CLUSTER:
						if ( world.steps % 4 == 0 ) {
							var bullet = new Bullet({
								x  : this.x,
								y  : this.y,
								vx : this.vx + ( -5 + Math.random() * 10 ),
								vy : this.vy + ( -5 + Math.random() * 10 )
							});
							world.bullets[ bullet.id ] = bullet;
						}
				}
			}
		},

		explode : function( damage, ignore_ground ){
			var damage = damage || 16;

			switch( this.type ) {
				case world.WEAPON_ATOM:
					damage = 64;
					break;
				case world.WEAPON_STRONG:
					damage = 32;
					break;
				case world.WEAPON_CLUSTER:
					damage = 8;
					break;
			}

			if ( !ignore_ground ) {
				world.destroyMap( this.x, this.y, world['SPRITE_DAMAGE_' + damage] );
			}
			world.destroyCreepersInRange( this.x, this.y, damage );

			var size = world.resources[ world['SPRITE_DAMAGE_' + damage ] ].height;

			var explosion = new world.Explosion({
				x            : this.x,
				y            : this.y,
				sprite       : world['SPRITE_DAMAGE_' + damage],
				w            : size,
				h            : size,
				draw_shift_x : -size/2,
				draw_shift_y : -size/2
			})

			world.explosions[ explosion.id ] = explosion;

			delete world.bullets[ this.id ];
		},

		getLavaCollision : function(){
			if ( world.is_lava_rising ) {
				if ( this.y > world.G_HEIGHT - world.lava_height ) {
					return true;
				}
			}
			return false;
		},

		getCreeperCollision : function(){
			for ( var i in world.creepers ) {
				var creeper = world.creepers[i];
				if ( creeper.x <= this.x && creeper.x + creeper.w >= this.x && creeper.y <= this.y && creeper.y + creeper.w >= this.y ) {
					return true;
				}
			}
			return false;
		},

		getGroundCollision : function( ) {
			var ground_width = world.G_WIDTH

			x = Math.round(this.x);
			y = Math.round(this.y -  ( world.G_HEIGHT - world.GROUND_HEIGHT )) ;

			w = Math.round(this.w);
			h = Math.round(this.h);

			if ( y < 0 ) return false;

			var imagedata = world._collision_image_data;

			for( var i = 0; i < h; ++i) {
				for( var j = 0; j < w; ++j ) {
					var index = ( x + j ) + ( y + i ) * ground_width;
					if ( typeof imagedata[ index ] != 'undefined' && imagedata[ index ] != 0) {
						return true
					}
				}
			}

			return false;
		},

		getGroundCollision_ : function(){
			var r    = this.w / 2,
				data = world.layers[ world.LAYER_GROUND ].getImageData(this.x, this.y, r, r );

			var collide = false;

			for( var i = 0, l = data.data.length / ( r * 2 ); i <= l; i += 4  ) {
				var pixel = this.getPixel(i, data);
				if ( this.isCollidingPixel( pixel ) ) {
					return true;
				}
			}

			return false;
		}
	});

	world.Bullet = Bullet;
}();