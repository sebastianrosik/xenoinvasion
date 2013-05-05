!function(){

	function Explosion( options ){
		for( var i in options ) {
			this[i] = options[i]
		}
		var self = this;
		this.id = '_' + Math.round( Math.random() * 100000 ).toString(16);
		this.setAnimation( this.sprite, 'once', function(){
			delete world.explosions[ self.id ]
		});
		world.quake( this.quake );

		var volume = 1;

		switch( this.sprite ) {
			case world.SPRITE_DAMAGE_32:
				volume = 0.6;
				break;

			case world.SPRITE_DAMAGE_16:
				volume = 0.4
				break;

			case world.SPRITE_DAMAGE_8:
				volume = 0.2
				break;
		}

		this.sfxBum( volume );
	}

	Explosion.prototype = {};

	world.extend(Explosion.prototype, world.Entity.prototype);
	world.extend(Explosion.prototype, {
		w : 32,

		h : 32,
		
		collection : 'explosions',

		draw_shift_x : -16,

		draw_shift_y : -16,

		vx : 0,

		vy : 0,
		
		weight : 0,

		max_speed : 0,

		sfxBum : function( volume ){
			if ( world.can_play_audio && !world.mute ) {
				for( var i = 0, l = world.sfx_bum.length; i < l; ++i ) { 
					if ( world.sfx_bum[i].paused || world.sfx_bum[i].currentTime >= world.sfx_bum[i].duration  ) {
						world.sfx_bum[i].volume = volume;
						world.sfx_bum[i].play();
						break;
					}
				}
			}
		},

		outOfBoundaries: function(){
			// pls do nothing k thx
		},

		step : function(){
			world.Entity.prototype.step.call( this )
		}
	});

	world.Explosion = Explosion;
}();