!function( global ){

	var world = {

		// Total width of the game
		G_WIDTH : 640,

		// Total height of the game
		G_HEIGHT : 480,

		// How much the map move during the earth quake
		QUAKE_MAX_PX : 5,

		// How much we need to grondify() a creeper.
		CREEPER_HORIZ_COLLIDE : 4,


		// Well, that's obvious, isn't it?
		GRAVITATION : 1,

		// How much the base should be damagen in every step when a creeper attacks.
		CREEPER_ATTACK_DAMAGE : 0.01,


		// Just some layers
		LAYER_GROUND : 'resources/ground.png',
		
		LAYER_ENTITIES : 'entities',

		LAYER_BASE : 'base',

		LAYER_GUNS : 'guns',


		// Sprites for creepers (animations)		
		SPRITE_CREEPER_ATTACK    : 'resources/creeper-attack.png',
		SPRITE_CREEPER_WALK      : 'resources/creeper-walk.png',
		SPRITE_CREEPER_GROUNDIFY : 'resources/creeper-groundify.png',


		// Base 00 - full HP, Base 09 - no HP.
		SPRITE_BASE_00 : 'resources/base00.png',
		SPRITE_BASE_01 : 'resources/base01.png',
		SPRITE_BASE_02 : 'resources/base02.png',
		SPRITE_BASE_03 : 'resources/base03.png',
		SPRITE_BASE_04 : 'resources/base04.png',
		SPRITE_BASE_05 : 'resources/base05.png',
		SPRITE_BASE_06 : 'resources/base06.png',
		SPRITE_BASE_07 : 'resources/base07.png',
		SPRITE_BASE_08 : 'resources/base08.png',
		SPRITE_BASE_09 : 'resources/base09.png',

		// Some random stuff
		SPRITE_BULLET   : 'resources/bullet.png',
		SPRITE_GUN1     : 'resources/gun1.png',
		SPRITE_GUN2     : 'resources/gun2.png',
		SPRITE_POWERBAR : 'resources/power.png',
		SPRITE_COLUMN   : 'resources/column.png',


		// Explosions
		SPRITE_DAMAGE_64 : 'resources/damage_64.png',
		SPRITE_DAMAGE_32 : 'resources/damage_32.png',
		SPRITE_DAMAGE_16 : 'resources/damage_16.png',
		SPRITE_DAMAGE_8  : 'resources/damage_8.png',


		// icons
		SPRITE_WEAPONS : 'resources/ammo-icons.png',


		// All the weapons
		WEAPON_NORMAL  : 'normal',
		WEAPON_STRONG  : 'strong',
		WEAPON_CLUSTER : 'cluster',
		WEAPON_MEGA    : 'mega',
		WEAPON_CARPET  : 'carpet',
		WEAPON_ATOM    : 'atom',


		// How often the wind should change in milliseconds
		WIND_RANDOMIZE_INTERVAL : 4000,

		// How often we should get a new bullet in milliseconds?
		NEW_BULLETS_INTERVAL : 750,


		// Base coordinates and dimensions
		BASE_X      : 288,
		BASE_Y      : 298,
		BASE_WIDTH  : 80,
		BASE_HEIGHT : 54,

		// Dooh
		FPS : 1000 / 60,


		// We need gun, a lot of guns!
		GUN_ROTATE_SPEED : 0.03,
		GUN_POWER_SPEED  : 0.02,
		GUN_ANGLE_LIMIT  : 1.74,
		GUN1_X : 301,
		GUN1_Y : 312,
		GUN2_X : 350,
		GUN2_Y : 312,


		// Various game states
		STATE_PLAY  : 'play',
		STATE_PAUSE : 'pause',
		STATE_GAME_OVER : 'game_over',
		STATE_FINAL : 'final',

		// Maximum height of lava when it rises.
		LAVA_LIMIT : 100,

		// Height of the ground collision layer
		GROUND_HEIGHT : 150,

		// Candy for ears.
		AUDIO_BG              : 'resources/audio/bg' ,
		AUDIO_BUM             : 'resources/audio/bum',
		AUDIO_FIRE            : 'resources/audio/fire',
		AUDIO_LAVA            : 'resources/audio/lava',
		AUDIO_GAMEEND         : 'resources/audio/gameend',
		AUDIO_I_WILL_KILL_YOU : 'resources/audio/I_will_kill_you',


		// How many 'fire' sounds should play at a time.
		SFX_FIRE_AT_ONCE_COUNT : 5,

		// How many 'bum' sounds should play at a time.
		SFX_BUM_AT_ONCE_COUNT : 5,


		// How many creepers need to die, before the lava resets the ground.
		CREEPERS_IN_LAVA_COUNT_TO_RELEASE_LAVA : 20,

		mute : false,

		can_play_audio : true,

		creepers : {},

		bullets : {},

		explosions : {},

		layers : {},

		time : 0,

		delta_time : 0,

		level_time : 0,

		killed_creepers : 0,

		delta_time : 0,

		start_time : 0,

		steps : 0,

		base_hp : 9,

		gun1_angle : 0,

		gun2_angle : 0,

		gun1_power : 0,

		gun2_power : 0,

		max_base_hp : 9,

		wind : 0,

		is_paused : false,

		game_over_progress : 0,

		state : null,

		fired_bullets : 0,

		remaining_bullets_count : 0,

		is_lava_rising : false,

		lava_height : 0,

		lava_solidity : 0,

		creepers_in_lava : 0,

		is_dev : false,

		releaseLava : function(){
			if ( this.is_lava_rising ) return;
			this.is_lava_rising = true;
			if ( this.can_play_audio && !this.mute ) {
				this.audios[ this.AUDIO_LAVA ].play()
			}
		},

		riseLava : function(){
			var g_ctx = this.layers[ this.LAYER_GROUND ],
				l_ctx = this.layers[ this.LAYER_LAVA   ];
			
			var lava_height = this.lava_height,
				lava_y      = this.G_HEIGHT - lava_height;
		

			if ( this.lava_height < this.LAVA_LIMIT ) {
				l_ctx.clearRect( 0, 0, this.G_WIDTH, this.G_HEIGHT );

				l_ctx.beginPath();
				l_ctx.fillStyle = this.steps % 2 == 0 ? '#f30000' : '#ff2508';
				l_ctx.rect( 0, lava_y, this.G_WIDTH, this.G_HEIGHT - lava_height );
				l_ctx.fill();
				l_ctx.closePath();

				l_ctx.beginPath();
				l_ctx.fillStyle = this.steps % 2 == 0 ? '#ff5a00' : '#ff7e00';
				l_ctx.rect( 0, lava_y, this.G_WIDTH, 20 );
				l_ctx.fill();
				l_ctx.closePath();

				l_ctx.beginPath();
				l_ctx.fillStyle = this.steps % 2 == 0 ? '#ffcc00' : '#ffe400';
				l_ctx.rect( 0, lava_y, this.G_WIDTH, 10 );
				l_ctx.fill();
				l_ctx.closePath();

				l_ctx.beginPath();
				l_ctx.fillStyle = this.steps % 2 == 0 ? '#fff9c6' : '#ffffff';
				l_ctx.rect( 0, lava_y, this.G_WIDTH, 2 );
				l_ctx.fill();
				l_ctx.closePath();

				this.lava_height += 1;
				this.updateCollisionLayer('rect', 0, 0, this.G_HEIGHT - this.lava_height, this.G_WIDTH, 2, 1 );

			} else {
				l_ctx.save();
				l_ctx.globalAlpha = 0.3;
				l_ctx.beginPath();
				l_ctx.fillStyle = '#370900';
				l_ctx.rect( 0, lava_y, this.G_WIDTH, lava_height);
				l_ctx.fill();
				l_ctx.closePath();
				l_ctx.globalAlpha = 0.1;
				l_ctx.drawImage( this.resources[ this.LAYER_GROUND ], 0, lava_y, this.G_WIDTH, lava_height,  0, lava_y, this.G_WIDTH, lava_height );
				l_ctx.restore();
				
				this.lava_solidity += 0.05;
				

				if ( this.lava_solidity >= 1 ) {
					this.is_lava_rising = false;
					this.lava_height    = 0;
					this.lava_solidity  = 0;
					
					l_ctx.globalAlpha = 1;
					l_ctx.drawImage( this.resources[ this.LAYER_GROUND ], 0, lava_y, this.G_WIDTH, lava_height,  0, lava_y, this.G_WIDTH, lava_height );
					g_ctx.drawImage( l_ctx.canvas, 0, 0, this.G_WIDTH, this.G_HEIGHT );
					l_ctx.clearRect(0, 0, this.G_WIDTH, this.G_HEIGHT);
				}
			}

			this.killCreepersWithLava();
		},

		killCreepersWithLava : function(){
			var lava_height = this.lava_height,
				lava_y      = this.G_HEIGHT - lava_height;

			for ( var i in world.creepers ) {
				var creeper = world.creepers[i],
					cr_y    = creeper.y + creeper.h / 2;

				if ( cr_y >= lava_y ){
					creeper.kill();
				}
			}

		},

		sortByHighScore : function(){

		},

		saveScore : function(){
			if ( window.localStorage && window.localStorage.setItem ){
				var score = localStorage.getItem('score');
				
				if ( !score ) {
					score = [];
				} else {
					score = JSON.parse( score );
				}
				
				score.push({
					kills : this.killed_creepers,
					time  : this.level_time,
					date  : new Date().getTime()
				});

				score.sort(this.sortByHighScore);

				localStorage.setItem('score', JSON.stringify(score));
			}
		},

		addLeadingZero : function( number ) {
			if ( number < 10 ) {
				return '0' + number;
			}

			return number.toString();
		},

		parseTime : function( time ){
			var seconds = time / 1000,
				minutes =  Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);

			return this.addLeadingZero( minutes ) + ':' + this.addLeadingZero( Math.floor( seconds ) % 60 );
		},

		gameOver : function(){
			this.container.className = 'game_over'
			this.game_over_progress += 0.01;
			this.state = this.STATE_GAME_OVER;
			this.saveScore();
			if ( this.can_play_audio && !this.mute ) {
				this.audios[ this.AUDIO_GAMEEND ].play()
			}
		},

		finalize : function(){
			this.container.className = 'final'
			this.state = this.STATE_FINAL;
			this.showScores();
			this.reset();
		},

		showScores : function(){
			document.getElementById('screen-scores').style.display = 'block';
			document.getElementById('kills-score').innerText = this.killed_creepers;
			document.getElementById('time-score').innerText = this.parseTime( this.level_time );
		},

		hideScores : function(){
			document.getElementById('screen-scores').style.display = 'none';
		},

		showMenu : function(){
			document.getElementById('screen-menu').style.display = 'block';
			if ( world.can_play_audio && !world.mute ) {
				this.stopAllSounds();
				this.audios[ this.AUDIO_I_WILL_KILL_YOU ].loop = false;
				this.audios[ this.AUDIO_I_WILL_KILL_YOU ].play();
				this.audios[ this.AUDIO_I_WILL_KILL_YOU ].addEventListener('ended', function(){
					if ( world.can_play_audio && !world.mute ) {
						world.stopAllSounds();
						world.audios[ world.AUDIO_BG ].loop = true;
						world.audios[ world.AUDIO_BG ].play();
					}
				});
			}
		},

		hideMenu : function(){
			document.getElementById('screen-menu').style.display = 'none';
		},

		hidePreloader : function(){
			document.getElementById('screen-preloader').style.display = 'none';
		},

		stopAllSounds : function(){
			if ( this.can_play_audio ) {
				for( var i in this.audios ) {
					this.audios[i].pause();
					this.audios[i].currentTime = 0;
				}
			}
		},

		reset : function(){
			for( var i in this.waves ) {
				this.waves[i].spawned_creepers = 0;
			}
			this.current_weapon          = self.WEAPON_NORMAL;
			this.current_wave            = 0;
			this.creepers                = {};
			this.bullets                 = {};
			this.explosions              = {};
			this.killed_creepers         = 0;
			this.delta_time              = 0;
			this.start_time              = 0;
			this.steps                   = 0;
			this.base_hp                 = 9;
			this.gun1_angle              = 0;
			this.gun2_angle              = 0;
			this.gun1_power              = 0;
			this.gun2_power              = 0;
			this.wind                    = 0;
			this.fired_bullets           = 0;
			this.remaining_bullets_count = 0;
			this.is_lava_rising          = false;
			this.lava_height             = 0;
			this.lava_solidity           = 0;
			this.game_over_progress      = 0;
		},


		extend : function( obj1, obj2 ){
			for( var i in obj2 ) {
				obj1[ i ] = obj2[ i ];
			}
		},

		windRandomizer : function(){
			this.wind = Math.round( Math.random() * 8 ) - 4;
			this.updateWindGUI();
		},


		damageBase : function(){
			if ( Math.random() > 0.87  ) {
				var r = Math.random();
				var sprite = world.SPRITE_DAMAGE_8;
				
				if ( r > 0.9 ) {
					var sprite = world.SPRITE_DAMAGE_32
				} else if ( r > 0.6 ) {
					var sprite = world.SPRITE_DAMAGE_16
				}

				var size = world.resources[ sprite ].height;

				var explosion = new world.Explosion({
					quake        : 'base',
					x            : this.BASE_X + this.BASE_WIDTH  * Math.random(),
					y            : this.BASE_Y + this.BASE_HEIGHT * Math.random() + 20,
					sprite       : sprite,
					w            : size,
					h            : size,
					draw_shift_x : -size/2,
					draw_shift_y : -size/2
				})

				world.explosions[ explosion.id ] = explosion;
			}
			
			if ( this.base_hp < 0 ) {
				return;
			}
			this.renderBase();
		},

		renderBase : function(){
			var base_sprite_id = world['SPRITE_BASE_0' + Math.floor( this.max_base_hp - this.base_hp ) ];

			world.layers[ world.LAYER_BASE ].clearRect( world.BASE_X, world.BASE_Y, world.resources[ base_sprite_id ].width, world.resources[ base_sprite_id ].height  );

			world.layers[ world.LAYER_BASE ].drawImage( world.resources[ world.SPRITE_COLUMN ],
														0, 0, 
														world.resources[ world.SPRITE_COLUMN  ].width,
														world.resources[ world.SPRITE_COLUMN  ].height,
														world.BASE_X, 
														world.BASE_Y + world.resources[ base_sprite_id ].height,
														world.resources[ world.SPRITE_COLUMN  ].width,
														world.resources[ world.SPRITE_COLUMN  ].height
													);
			world.layers[ world.LAYER_BASE ].drawImage( world.resources[ base_sprite_id ], 
														0, 0, 
														world.resources[ base_sprite_id ].width,
														world.resources[ base_sprite_id ].height,
														world.BASE_X, 
														world.BASE_Y,
														world.resources[ base_sprite_id ].width,
														world.resources[ base_sprite_id ].height
													);
		
			this.updateHealthGUI();
		},

		updateHealthGUI : function(){
			var info_el = document.getElementById('base_hp');
			info_el.firstChild.style.width = Math.round( this.base_hp / this.max_base_hp * 100 ) + 'px'
		},

		updateWindGUI : function(){
			var wind_el = document.getElementById('wind');
			wind_el.className = 'wind_' + this.wind;
		},

		updateWeaponGUI : function(){
			var weapons_el = document.getElementById('weapons');
			weapons_el.className = this.current_weapon;
		},

		updateTimeGUI : function(){
			var time_el = document.getElementById('time');
			time_el.innerText = this.parseTime( this.level_time );
		},

		updateKillsGUI : function(){
			var kills_el = document.getElementById('kills');
			kills_el.firstChild.innerText = 'x ' + this.killed_creepers;
		},

		updateBulletsGUI : function(){
			var bullets_el = document.getElementById('bullets');
			var label_el = bullets_el.firstChild;
			label_el.innerText = 'x ' + this.remaining_bullets_count;
		},


		updateTime : function(){
			var time           = new Date().getTime() - this.start_time;
			this.delta_time    = time - this.time || 0;
			this.time          = time;

			if ( !this.is_paused ) {
				this.level_time += this.delta_time;			
			}
		},

		step : function(){
		 	
			this.steps++;

			
			if ( !this.is_lava_rising ) {
				for( var i in this.signals ) {
					this[i] && this[i]();
				}

				for ( var i in world.creepers ) {
					world.creepers[i].step();
				}

				for ( var i in world.bullets ) {
					world.bullets[i].step();
				}
			}

			for ( var i in world.explosions ) {
				world.explosions[i].step();
			}

			if ( this.base_hp <= 0 ) {
				this.gameOver();
			}

			if ( this.is_lava_rising ) {
				this.riseLava();
			}

			if ( this.creepers_in_lava >= this.CREEPERS_IN_LAVA_COUNT_TO_RELEASE_LAVA ) {
				this.releaseLava();
				this.creepers_in_lava = 0
			}
		},

		draw : function(){
			for ( var i in world.creepers ) {
				world.creepers[i].draw()
			}

			for ( var i in world.bullets ) {
				world.bullets[i].draw()
			}

			for ( var i in world.explosions ) {
				world.explosions[i].draw()
			}
		},

		clear : function(){
			this.layers[ world.LAYER_ENTITIES ].clearRect( 0, 0, this.layers[ world.LAYER_ENTITIES ].canvas.width, this.layers[ world.LAYER_ENTITIES ].canvas.height );
		},

		destroyMap : function( x, y, damage ) {
			var frame_size = this.resources[ damage ].height;

			var ctx = this.layers[ this.LAYER_GROUND ];

			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.drawImage( this.resources[ damage ], 0, 0, frame_size, frame_size, x - frame_size / 2, y - frame_size / 2, frame_size, frame_size )
			ctx.restore();

			this.updateCollisionLayer( 'circle', frame_size, 
				x - frame_size / 2 , 
				y - frame_size / 2 , 
				frame_size, 
				frame_size, 0 );
		},

		getDistance : function( a, b ){
			return Math.pow( a.x - b.x, 2 ) + Math.pow( a.y - b.y, 2 );
		},

		destroyCreepersInRange : function( x, y, range){
			for( var i in this.creepers ) {
				var d = this.getDistance( this.creepers[i], {
					x : x,
					y : y
				})
				if ( d <= Math.pow(range,2) ){
					this.creepers[i].kill();
				}
			}
		},

		signals : {},

		signalOn : function( signal_name ){
			if ( signal_name ) {
				this.signals[ signal_name ] = true;
			}
		},

		signalOff : function( signal_name ){
			if ( signal_name ) {
				delete this.signals[ signal_name ];
			}
		},

		player1_left : function(){
			this.gun1_angle -= this.GUN_ROTATE_SPEED;
			if ( Math.abs( this.gun1_angle ) >= this.GUN_ANGLE_LIMIT ) {
				this.gun1_angle = -this.GUN_ANGLE_LIMIT;
			}
			this.updateGuns();
		},

		player1_right : function(){
			this.gun1_angle += this.GUN_ROTATE_SPEED;
			if ( this.gun1_angle >= this.GUN_ANGLE_LIMIT ) {
				this.gun1_angle = this.GUN_ANGLE_LIMIT;
			}
			this.updateGuns();
		},

		player2_left : function(){
			this.gun2_angle -= this.GUN_ROTATE_SPEED;
			if ( Math.abs( this.gun2_angle ) >= this.GUN_ANGLE_LIMIT ) {
				this.gun2_angle = -this.GUN_ANGLE_LIMIT;
			}
			this.updateGuns();
		},

		player2_right : function(){
			this.gun2_angle += this.GUN_ROTATE_SPEED;
			if ( this.gun2_angle >= this.GUN_ANGLE_LIMIT ) {
				this.gun2_angle = this.GUN_ANGLE_LIMIT;
			}
			this.updateGuns();
		},

		player1_up : function(){
			this.gun1_power += this.GUN_POWER_SPEED;
			if( this.gun1_power > 1 ) {
				this.gun1_power = 1
			}
			this.updateGuns();
		},

		player2_up : function(){
			this.gun2_power += this.GUN_POWER_SPEED;
			if( this.gun2_power > 1 ) {
				this.gun2_power = 1
			}
			this.updateGuns();
		},

		sfxFire : function(){
			if ( this.can_play_audio && !this.mute ) {
				for( var i = 0, l = this.sfx_fire.length; i < l; ++i ) {
					if ( this.sfx_fire[i].paused || this.sfx_fire[i].currentTime >= this.sfx_fire[i].duration ) {
						this.sfx_fire[i].play();
						break;
					}
				}
			}
		},

		fire : function( x, y, power, angle ){

			if ( !this.remaining_bullets_count || this.state == this.STATE_GAME_OVER ) {
				return;
			}

			var v = 20 * power,
				r = 19;

			var ang = -angle + Math.PI / 2;

			var vx = v * Math.cos( ang ),
				vy = -v * Math.sin( ang );

			var bullet = new world.Bullet({
				type : this.current_weapon,
				vy   : vy,
				vx   : vx + this.wind,
				x    : x + r * Math.cos( ang ),
				y    : y - r * Math.sin( ang )
			});

			world.bullets[ bullet.id ] = bullet;

			world.manageFiredBullets();
			world.remaining_bullets_count--;

			//this.createSound( world.AUDIO_FIRE, 0.5 );
			this.sfxFire();
		},

		fireGun1 : function(){
			this.fire(this.GUN1_X + 2.5, this.GUN1_Y + 21, this.gun1_power, this.gun1_angle );
			this.gun1_power = 0;
			this.updateGuns();
		},

		fireGun2 : function(){
			this.fire(this.GUN2_X + 2.5, this.GUN2_Y + 21, this.gun2_power, this.gun2_angle );
			this.gun2_power = 0;
			this.updateGuns();
		},

		manageFiredBullets : function(){
			this.fired_bullets++;

			world.current_weapon = world.WEAPON_NORMAL;

			if ( this.fired_bullets % 5 == 0 ) {
				this.current_weapon = this.WEAPON_STRONG;
			} 

			if ( this.fired_bullets % 10 == 0 ) {
				this.current_weapon = this.WEAPON_CLUSTER;
			} 

			if ( this.fired_bullets % 12 == 0 ) {
				this.current_weapon = this.WEAPON_MEGA;
			}

			if ( this.fired_bullets % 21 == 0 ) {
				this.current_weapon = this.WEAPON_CARPET;
			}

			if ( this.fired_bullets % 50 == 0 ) {
				this.current_weapon = this.WEAPON_ATOM;
			}

			this.updateWeaponGUI();
		},

		bindEvents : function( element ){
			var self = this;

			function processSignal(keycode){
				var signal_name;
				switch( keycode ) {
					case 87: // W
						signal_name = 'player1_up';
						break;
					case 65: // A
						signal_name = 'player1_left';
						break;
					case 68: // D
						signal_name = 'player1_right';
						break;

					case 38: // UP ARROW
						signal_name = 'player2_up';
						break;
					case 37: // LEFT ARROW
						signal_name = 'player2_left';
						break;
					case 39: // RIGHT ARROW
						signal_name = 'player2_right';
						break;
				}
				return signal_name;
			}

			document.addEventListener('keydown', function(e){
				self.signalOn( processSignal( e.which ));

				if ( self.is_dev ) {
					if (e.which == 49 ) { // key 1
						if ( self.is_paused ) {
							self.resume();
						} else {
							self.pause();
						}
						e.preventDefault();

					} else if (e.which == 50 ) { // key 2
						self.current_weapon = self.WEAPON_NORMAL;
						self.updateWeaponGUI();
						e.preventDefault();

					} else if (e.which == 51 ) { // key 3
						self.current_weapon = self.WEAPON_CLUSTER;
						self.updateWeaponGUI();
						e.preventDefault();

					} else if (e.which == 52 ) { // key 4
						self.current_weapon = self.WEAPON_MEGA;
						self.updateWeaponGUI();
						e.preventDefault();

					} else if (e.which == 53 ) { // key 5
						self.current_weapon = self.WEAPON_CARPET;
						self.updateWeaponGUI();
						e.preventDefault();

					} else if (e.which == 54 ) { // key 6
						self.current_weapon = self.WEAPON_ATOM;
						self.updateWeaponGUI();
						e.preventDefault();
					}
				}
			});

			document.addEventListener('keyup', function(e){
				self.signalOff( processSignal( e.which ));
				if ( e.which == 87 ) {
					self.fireGun1()
				} else if (e.which == 38 ) {
					self.fireGun2()
				}
			});


			// MENU SCREEN
			document.getElementById('start').addEventListener('click',function(e){
				world.hideMenu();
				world.start();
			});

			// GAME OVER SCREEN
			document.getElementById('play-again').addEventListener('click',function(e){
				self.hideScores();
				world.start();
			});

			document.getElementById('mute').addEventListener('click', function(){
				if ( !self.mute ) {
					world.audios[ world.AUDIO_BG ].pause();
					world.audios[ world.AUDIO_I_WILL_KILL_YOU  ].pause();
					
					for( var i in world.sfx_fire ) {
						world.sfx_fire[i].pause();
					}
					for( var i in world.sfx_bum ) {
						world.sfx_bum[i].pause();
					}
				} else {
					world.audios[ world.AUDIO_BG ].play();
				}
				self.mute = !self.mute;
				if ( typeof localStorage != 'undefined' && typeof localStorage.setItem == 'function' ) {
					localStorage.setItem('mute', self.mute ? 1 : 0 );
				}

				this.className = self.mute ? 'muted' : '';
			});

			document.getElementById('fullscreen').addEventListener('click', function(){
				self.toggleFullScreen()
			})


			var fullscreen_event_name = 'fullscreenchange';

			if ( document.documentElement.webkitRequestFullscreen ) {
				fullscreen_event_name = 'webkitfullscreenchange';
			} else if ( document.documentElement.mozRequestFullScreen ) {
				fullscreen_event_name = 'mozfullscreenchange';
			}

			document.addEventListener( fullscreen_event_name, function(){
				if ( self.isFullscreen() ) {
					document.body.className = 'fullscreen';
				} else {
					document.body.className = '';
				}
				self.centerContainer();
			});

			window.addEventListener('focus', function() {
			    self.resume();
			});

			window.addEventListener('blur', function() {
			    self.pause();
			});
		},

		pause : function(){
			this.is_paused = true;
			document.getElementById('paused').className = 'visible';
		},
		
		resume : function(){
			this.is_paused = false;
			document.getElementById('paused').className = '';
		},

		centerContainer : function(){
			var margin_left = -this.G_WIDTH  / 2,
				margin_top  = -this.G_HEIGHT / 2,
				width       = this.G_WIDTH,
				height      = this.G_HEIGHT;

			if ( this.isFullscreen() ) {
				width  = screen.availWidth;
				height = screen.availHeight;
				margin_left = Math.round(-width  / 2);
				margin_top  = Math.round(-height / 2);
			}

			this.container.style.width       = width + 'px';
			this.container.style.height      = height + 'px';
			this.container.style.marginLeft  = margin_left + 'px';
			this.container.style.marginTop   = margin_top + 'px';
		},

		isFullscreen : function(){
			return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		},

		// TODO: fullscreen needs some changes in the GUI (css) to be working properly
		toggleFullScreen : function(){
			if ( !this.isFullscreen() ) {
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		},

		init : function( container_id ){
			var self = this;

			this.state = this.STATE_PAUSE;
			this.current_weapon = this.WEAPON_NORMAL;

			var container = document.getElementById( container_id );

			container.style.width      = ( world.G_WIDTH - world.QUAKE_MAX_PX * 2 ) + 'px';
			container.style.height     = world.G_HEIGHT + 'px';
			container.style.marginLeft = -(world.G_WIDTH - world.QUAKE_MAX_PX * 2)  / 2 + 'px';
			container.style.marginTop  = -world.G_HEIGHT / 2 + 'px';

			var canvas_ground = document.createElement('canvas'),
				ctx_ground    = canvas_ground.getContext('2d');

			var canvas_creepers = document.createElement('canvas'),
				ctx_creepers    = canvas_creepers.getContext('2d');

			// BASE Layer
			var canvas_base = document.createElement('canvas'),
				ctx_base    = canvas_base.getContext('2d');

			var canvas_guns = document.createElement('canvas'),
				ctx_guns    = canvas_guns.getContext('2d');

			var canvas_lava = document.createElement('canvas'),
				ctx_lava    = canvas_lava.getContext('2d');


			// Now we are exposing our layers
			this.layers[ world.LAYER_BASE     ] = ctx_base;
			this.layers[ world.LAYER_GROUND   ] = ctx_ground;
			this.layers[ world.LAYER_ENTITIES ] = ctx_creepers;
			this.layers[ world.LAYER_GUNS     ] = ctx_guns;

			this.layers[ world.LAYER_LAVA     ] = ctx_lava;

			canvas_lava.setAttribute('id', 'lava');
			canvas_base.setAttribute('id', 'base');
			canvas_ground.setAttribute('id', 'ground');

			// And appending them to the DOM tree
			for( var i in this.layers ) {
				this.layers[i].canvas.width  = world.G_WIDTH;
				this.layers[i].canvas.height = world.G_HEIGHT;
				container.appendChild( this.layers[i].canvas )
			}


			this.container = container;
			this.bindEvents( container );



			////////////////////////////////////////////
			// AUDIO

			var mute = localStorage.getItem('mute');

			if ( mute ) {
				self.mute = +mute
			}

			if ( self.mute ) {
				document.getElementById('mute').className = 'muted';
			}

			// Detecting audio support
			var a_types = {
				'audio/mpeg; codecs="mp3"'   : 'mp3',
				'audio/ogg; codecs="vorbis"' : 'ogg'
			}

			var audio = document.createElement('audio');
			
			world.audio_type = null;

			for( var i in a_types ) {
				if ( !!(audio.canPlayType && audio.canPlayType( i ).replace(/no/, '')) ) {
					world.audio_type = a_types[i];
				}
			}

			world.sfx_fire = [];
			world.sfx_bum  = [];

			// Finally, we can preload all the assets.
			this.preload( this.assets, function(){
				if ( world.can_play_audio ){
					var sfx_f_count = world.SFX_FIRE_AT_ONCE_COUNT,
						sfx_b_count = world.SFX_BUM_AT_ONCE_COUNT;

					while( sfx_f_count-- ) {
						var sound = new Audio();
						sound.src = world.audios[ world.AUDIO_FIRE ].src;
						world.sfx_fire.push( sound );
					}

					while( sfx_b_count-- ) {
						var sound = new Audio();
						sound.src = world.audios[ world.AUDIO_BUM ].src;
						world.sfx_bum.push( sound );
					}
				}
				setTimeout(function(){
					self.hidePreloader();
					self.showMenu();
					self.run();
				}, 400);
			});
		},


		updateGuns : function(){
			var ctx = this.layers[ this.LAYER_GUNS ];

			var powerbar = this.resources[ this.SPRITE_POWERBAR ];
				
			var g1 = this.resources[ this.SPRITE_GUN1 ],
				g2 = this.resources[ this.SPRITE_GUN2 ];

			var g1x = this.GUN1_X,
				g1y = this.GUN1_Y,
				g2x = this.GUN2_X,
				g2y = this.GUN2_Y;

			ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

			ctx.save();
			ctx.translate( g1x + g1.width / 2, g1y + g1.height - 2);
			ctx.rotate( this.gun1_angle );
			ctx.translate(-g1x - g1.width / 2, -g1y - g1.height + 2);
			ctx.drawImage( g1, 0, 0, g1.width, g1.height, g1x, g1y, g1.width, g1.height );

			var h = powerbar.height * this.gun1_power;
			h && ctx.drawImage( powerbar, 0, powerbar.height - h, powerbar.width, h, g1x + 2 - powerbar.width / 2, g1y - h , powerbar.width, h);

			ctx.restore();

			ctx.save();
			ctx.translate( g2x + g2.width / 2, g2y + g2.height - 2);
			ctx.rotate( this.gun2_angle );
			ctx.translate(-g2x - g2.width / 2, -g2y - g2.height + 2);
			ctx.drawImage( g2, 0, 0, g2.width, g2.height, g2x, g2y, g2.width, g2.height );

			var h = powerbar.height * this.gun2_power;
			h && ctx.drawImage( powerbar, 0, powerbar.height - h, powerbar.width, h, g2x + 2 - powerbar.width / 2, g2y - h , powerbar.width, h);

			ctx.restore();
		},

		createMirrorResource : function( path ) {
			var canvas = this.resources[ path ];

			var mirror_canvas = document.createElement('canvas'),
				mirror_ctx    = mirror_canvas.getContext('2d');

			mirror_canvas.width  = canvas.width;
			mirror_canvas.height = canvas.height;
			
			mirror_ctx.save();
			mirror_ctx.scale(-1, 1);
			mirror_ctx.translate( -canvas.width ,0)
			mirror_ctx.drawImage( canvas, 0, 0, canvas.width, canvas.height );
			mirror_ctx.restore()

			this.mirror_resources[ path ] = mirror_canvas;
		},

		preload : function( to_load, fn ){
			var preloaded = 0,
				self      = this;

			function bump(){
				preloaded++;

				self.updatePreloadGUI( preloaded / to_load.length * 100 );
				
				if ( preloaded >= to_load.length ) {
					fn();
				}
			}

			to_load.forEach(function( path ){

				if ( path.indexOf('/audio') != -1 ) {
					// AUDIO files
					if ( self.can_play_audio ) {
						self.audios[ path ] = new Audio();
						self.audios[ path ].src = path + '.' + world.audio_type;
						self.audios[ path ].addEventListener('loadeddata', function(){
							self.resources[ path ] = self.audios[ path ];
							bump();
						});
						self.audios[ path ].load();
					} else {
						bump();
					}

				} else {
					// IMAGE files
					self.images[ path ] = new Image();
					self.images[ path ].src = path;
					self.images[ path ].onload = function(){
						self.resources[ path ] = document.createElement('canvas');
						
						self.resources[ path ].width  = this.width;
						self.resources[ path ].height = this.height;
						
						var ctx = self.resources[ path ].getContext('2d');

						ctx.drawImage( this, 0, 0, this.width, this.height );

						self.createMirrorResource( path );

						bump();
					}
				}
			});
		},

		updatePreloadGUI : function( percent ){
			var preloader_el = document.getElementById('preloader');
			preloader_el.firstChild.style.width = percent + '%';
		},

		run : function(){
			var self = this;

			// SPAWN points, (x, y, direction)
			world.spawners = [
				{ 	x : 2, 
					y : 320,
					direction : 1
				},
				{ 
					x : world.G_WIDTH - world.Creeper.prototype.w - 2, 
					y : 320,
					direction : -1 
				}
			];

			setInterval(function(){
				if ( self.is_paused || this.state != this.STATE_PLAY ) return;
				self.windRandomizer();
			}, world.WIND_RANDOMIZE_INTERVAL);

			setInterval(function(){
				if ( self.is_paused || this.state != this.STATE_PLAY ) return;
				self.remaining_bullets_count++;
				self.updateBulletsGUI();
			}, world.NEW_BULLETS_INTERVAL);


			if ( this.is_dev ) {
				this.stats = new Stats();
				this.stats.setMode(0); // 0: fps, 1: ms

				// Align top-left
				this.stats.domElement.style.position = 'absolute';
				this.stats.domElement.style.left = '0px';
				this.stats.domElement.style.top = '0px';

				document.body.appendChild( this.stats.domElement );
			}


			!function loop(){
				
				world.stats && world.stats.begin();
				world.updateTime()

				if ( !world.is_paused && world.state == world.STATE_PLAY ) {
					world.step();
					world.clear();
					world.draw();
					world.updateTimeGUI();
				}

				if ( world.game_over_progress ) {
					world.updateGameOverProgress()
				}

				setTimeout(function(){
					loop();
				}, world.FPS );
    			
    			world.stats && world.stats.end();
			}();
		},

		clip : function(x, y, w, h){
			
			if ( x >= this.G_WIDTH ) {
				x = this.G_WIDTH;
			}

			if ( x + w >= this.G_WIDTH ) {
				w = this.G_WIDTH - x;
			}

			if ( y >= this.GROUND_HEIGHT ) {
				y = this.GROUND_HEIGHT;
			}

			if ( y + h >= this.GROUND_HEIGHT ) {
				h = this.GROUND_HEIGHT - y;
			}

			if ( x < 0 ) {
				x = 0
			}

			return {
				x : x,
				y : y,
				w : w,
				h : h
			}
		},

		updateCollisionLayer : function( type, s, x, y, w, h, brush ){
			var ctx = this._alpha_ctx;

			var brush = brush ? 1 : 0;
			var ground_width = this.G_WIDTH;

			x = Math.round(x);
			y = Math.round(y - ( this.G_HEIGHT - this.GROUND_HEIGHT));
			w = Math.round(w);
			h = Math.round(h);


			var cx = x + w / 2 - 1,
				cy = y + h / 2 - 1;
		
			var clipped = this.clip( x, y, w, h );

			x = clipped.x;
			y = clipped.y;
			w = clipped.w;
			h = clipped.h;

			if ( w <= 0 || h <= 0 ) return;

			var size = Math.pow( s / 2, 2);

			if ( type == 'circle' ) {
				for( var i = 0; i < h ; i++ ) {
					for( var j = 0; j < w ; j++ ) {
						var index = ( x + j ) + ( y + i ) * ground_width;
						var d = Math.pow( (x + j) - cx , 2) + Math.pow( (y + i) - cy, 2 );

						if( d < size ) {
							if ( this.is_dev ) {
								this._alpha_ctx.fillStyle = 'green';
								this._alpha_ctx.beginPath();
								this._alpha_ctx.rect( x + j, y + i, 1, 1 );
								this._alpha_ctx.fill();
								this._alpha_ctx.closePath();
							}
							this._collision_image_data[ index ] = brush;
						}
					}
				}
			} else {
				for( var i = 0; i < h - 1; i++ ) {
					for( var j = 0; j < w - 1; j++ ) {
						var index = ( x + j ) + ( y + i ) * ground_width;
						if ( this.is_dev ) {
							this._alpha_ctx.fillStyle = '#fff';
							this._alpha_ctx.beginPath();
							this._alpha_ctx.rect( x + j, y + i, 1, 1 );
							this._alpha_ctx.fill();
							this._alpha_ctx.closePath();
						}
						this._collision_image_data[ index ] = brush;
					}
				}
			}

		},


		getCollisionPixels : function( x, y, w, h ) {
			var ground_width = this.G_WIDTH

			x = Math.round(x);
			y = Math.round(y - (this.G_HEIGHT - this.GROUND_HEIGHT));

			w = Math.round(w);
			h = Math.round(h);


			if ( y < 0 ) {
				y = 0;
				h -= y;				
			}

			if ( x < 0 ) {
				x = 0;
				w -= x;				
			}

			if ( w > this.G_WIDTH ) {
				w = this.G_WIDTH;
			}

			if ( h > this.GROUND_HEIGHT ) {
				h = this.GROUND_HEIGHT
			}

			if ( x + w > this.G_WIDTH ) {
				w = x + w + this.G_WIDTH;
			}

			if ( y + h > this.GROUND_HEIGHT ) {
				h = y + h + this.GROUND_HEIGHT;
			}

			if ( y < 0 || x < 0 || x > this.G_WIDTH || y > this.G_HEIGHT - this.GROUND_HEIGHT || w <= 0 || h <= 0 ) return [];

			var data = [],
				imagedata = this._collision_image_data;

			for( var i = 0; i < h; ++i) {
				for( var j = 0; j < w; ++j ) {
					var index = ( x + j ) + ( y + i ) * ground_width;
					if ( typeof imagedata[ index ] != 'undefined') {
						data.push( imagedata[ index ] )
					}
				}
			}

			return data;
		},


		drawCollisionLayer : function(){
			var canvas = document.createElement('canvas'),
				ctx    = canvas.getContext('2d');

			canvas.width  = this.G_WIDTH;
			canvas.height = this.GROUND_HEIGHT;

			ctx.drawImage( world.layers[ world.LAYER_GROUND ].canvas,
				0, this.G_HEIGHT - this.GROUND_HEIGHT, this.G_WIDTH, this.GROUND_HEIGHT,
				0, 0, this.G_WIDTH, this.GROUND_HEIGHT
			);

			this._alpha_image_data = ctx.getImageData(0, 0, canvas.width, canvas.height );
				
			this._collision_image_data = [];

			var limit = this._alpha_image_data.data.length - 1;
			
			for( var i = 0; i < limit; i += 4  ) {
				this._collision_image_data.push( this._alpha_image_data.data[ i + 3 ] != 0 ? 1 : 0 );
			}

			ctx.clearRect( 0, 0, canvas.width, canvas.height );

			this._alpha_canvas = canvas;
			this._alpha_ctx = ctx;
		},

		updateGameOverProgress : function(){
			this.game_over_progress += 0.01;

			if ( this.game_over_progress >= 1 ) {
				this.game_over_progress = 1;
				this.finalize();
			}

			var beam = document.getElementById('game_over_beam');

			beam.style.opacity    = 0.5 * Math.random() + 0.5;
			beam.style.width      =  200 * this.game_over_progress + 'px';
			beam.style.marginLeft = -100 * this.game_over_progress + 'px';

			this.layers[ world.LAYER_BASE ].canvas.style.top     = 50 * this.game_over_progress + 'px'
			this.layers[ world.LAYER_GROUND ].canvas.style.top   = 50 * this.game_over_progress + 'px'
			this.layers[ world.LAYER_ENTITIES ].canvas.style.top = 50 * this.game_over_progress + 'px'
			this.layers[ world.LAYER_GUNS ].canvas.style.top     = 50 * this.game_over_progress + 'px'

			var cinematic_cut1 = document.getElementById('cinematic_cut1'),
				cinematic_cut2 = document.getElementById('cinematic_cut2');

			cinematic_cut1.style.height = this.G_HEIGHT / 2 * this.game_over_progress + 'px';
			cinematic_cut2.style.height = this.G_HEIGHT / 2 * this.game_over_progress + 'px';
		},

		start : function(){
			this.state = this.STATE_PLAY;
			this.start_time = new Date().getTime();

			this.draw();
			this.renderBase();

			this.layers[ this.LAYER_GROUND ].clearRect( 0, 0, this.G_WIDTH, this.G_HEIGHT );
			this.layers[ this.LAYER_GROUND ].drawImage( this.resources[ this.LAYER_GROUND ], 0, 0 );
			this.updateGuns();
			this.drawCollisionLayer();
			this.startWave();
		},

		quake : function( element_id ){
			if ( arguments[0] === false ) {
				return;
			}
			if ( element_id ) {
				var element = document.getElementById( element_id ) ;
			} else {
				var element = this.container;
			}
			element.className = '';
			setTimeout(function(){
				element.className = 'quake';
			})
		},

		images : {},

		audios : {},

		resources : {},
		
		mirror_resources : {}
	}


	// Stuff to preload
	world.assets = [ 
		world.LAYER_GROUND,
		world.SPRITE_CREEPER_ATTACK,
		world.SPRITE_CREEPER_WALK,
		world.SPRITE_CREEPER_GROUNDIFY,
		world.SPRITE_BASE_00,
		world.SPRITE_BASE_01,
		world.SPRITE_BASE_02,
		world.SPRITE_BASE_03,
		world.SPRITE_BASE_04,
		world.SPRITE_BASE_05,
		world.SPRITE_BASE_06,
		world.SPRITE_BASE_07,
		world.SPRITE_BASE_08,
		world.SPRITE_BASE_09,
		world.SPRITE_BULLET,
		world.SPRITE_COLUMN,
		world.SPRITE_GUN1,
		world.SPRITE_GUN2,
		world.SPRITE_POWERBAR,
		world.SPRITE_DAMAGE_64,
		world.SPRITE_DAMAGE_32,
		world.SPRITE_DAMAGE_16,
		world.SPRITE_DAMAGE_8,
		world.SPRITE_WEAPONS,

		world.AUDIO_BG,
		world.AUDIO_BUM,
		world.AUDIO_FIRE,
		world.AUDIO_LAVA,
		world.AUDIO_GAMEEND,
		world.AUDIO_I_WILL_KILL_YOU
	];


	global.world = world;

}(this);