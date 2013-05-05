!function(){
	var waves = [
		{
			spawn_interval    : 1500,
			total_creepers    : 25,
			spawned_creepers  : 0,
			next_wave_timeout : 5000
		},
		{
			spawn_interval    : 500,
			total_creepers    : 40,
			spawned_creepers  : 0,
			next_wave_timeout : 1000
		},
		{
			spawn_interval    : 500,
			total_creepers    : 100,
			spawned_creepers  : 0,
			next_wave_timeout : 1000
		},
		{
			spawn_interval    : 250,
			total_creepers    : 100,
			spawned_creepers  : 0,
			next_wave_timeout : 1000
		},
		{
			spawn_interval    : 250,
			total_creepers    : 200,
			spawned_creepers  : 0,
			next_wave_timeout : 0
		},
		{
			spawn_interval    : 100,
			total_creepers    : 300,
			spawned_creepers  : 0,
			next_wave_timeout : 3000
		}
	];

	world.waves = waves;

	world.current_weve = 0;

	world.startWave = function(){
		this.current_weve = 0;
		clearInterval( this._wave_iid );
		this.nextWave();
	}

	world.nextWave = function(){
		if ( this.current_weve >= this.waves.length - 1 ) {
			this.current_weve = 0;
		}

		var wave = this.waves[ this.current_weve ];

		this._wave_iid = setInterval(function(){
			if ( !world.is_paused ) {
				var creeper1 = new world.Creeper(world.spawners[0]);
				var creeper2 = new world.Creeper(world.spawners[1]);

				world.creepers[ creeper1.id ] = creeper1;
				world.creepers[ creeper2.id ] = creeper2;
				wave.spawned_creepers++
			
				if ( wave.spawned_creepers >= wave.total_creepers ){
					wave.spawned_creepers = 0;
					clearInterval( world._wave_iid );
					setTimeout(function(){
						world.nextWave();
					}, wave.next_wave_timeout )
				}
			}
		}, wave.spawn_interval );
		
		this.current_weve++;
	};
}();