import * as MRE from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class SoundTest {

	private sound: MRE.Sound
	private root: MRE.Actor
	private assets: MRE.AssetContainer
	private button: MRE.Actor
	private text: MRE.Actor = null;
	private soundUrl = 'https://www.pacdv.com/sounds/voices/no-1.wav'

	/*
	 * constructor
	 */
	constructor(private context: MRE.Context) {

		this.context.onStarted(() => this.started());

	}


	
	private async loadSound() {

		this.assets = new MRE.AssetContainer(this.context);

        this.sound = this.assets.createSound('sound', { uri: this.soundUrl })

		this.root = MRE.Actor.Create(this.context, {});

		await this.sound.created

    }
	

	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {
		/*
		* set up somewhere to store loaded assets (meshes, textures,
		* animations, gltfs, etc.)
		*/

		// Create a new actor with no mesh, but some text.
		this.text = MRE.Actor.Create(this.context, {
			actor: {
				name: 'Text',
				transform: {
					app: { position: { x: 0, y: 0.5, z: 0 } }
				},
				text: {
					contents: "Sound Test",
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				}
			}
		});

		this.assets = new MRE.AssetContainer(this.context);

		this.button = MRE.Actor.CreatePrimitive(this.assets,
			{
				definition: { shape: MRE.PrimitiveShape.Box},
				actor: {
					transform: {
						local: {
							scale: { x: 0.6, y: 0.6, z: 0.6 }
						}
					},
					appearance: { enabled: true }
				},
				addCollider: true		/* Must have a collider for buttons. */
			}
		);
		
		this.button.created().then(() =>
		this.button.setBehavior(MRE.ButtonBehavior).onClick(() => this.startSound()));

		await Promise.all([this.loadSound()])

	}

	private startSound() {

		this.root.startSound(this.sound.id, 
			{
				volume: 0.2,
				looping: false,
				doppler: 0.0,
				spread: 0.7,
				rolloffStartDistance: 2.5,
				//time: 30.0
			})

	}
	
}
