import "@styles/svgs/create_party.scss"

const CreateParty: React.FC<{ width?: number; height?: number }> = ({ width = 200, height = 200 }) => {
    return (
		<div className="create_party-icon-wrapper" style={{width: width + "px", height: height + "px"}}>
        	<svg className="create_party-icon" width={width - 40} height={height - 40} version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 64 64">
			<g>
				<g>
					<path className="fandom_zes" d="M32,7C18.193,7,7,18.193,7,32h50C57,18.193,45.807,7,32,7z"/>
					<path className="fandom_vijf" d="M32,57c13.807,0,25-11.193,25-25H7C7,45.807,18.193,57,32,57z"/>
				</g>
				<g>
					<path className="fandom_negentien" d="M7.959,34.888c0.29-0.778-0.07-1.654-0.84-1.991l-2.887-1.261l2.838-6.496
						c0.348-0.797,1.277-1.161,2.074-0.813l4.331,1.892c0.797,0.348,1.161,1.277,0.813,2.074l-1.892,4.331l20.211,8.829
						c0.797,0.348,1.161,1.277,0.813,2.074l-0.911,2.086L7.959,34.888z M50.787,15.555c0.016,0.014,0.037,0.018,0.053,0.032
						c-0.639-0.54-0.905-1.532-0.121-2.315l2.228-2.228l-5.013-5.013c-0.615-0.615-1.613-0.615-2.228,0l-3.342,3.342
						c-0.615,0.615-0.615,1.613,0,2.228l3.342,3.342L30.11,30.538c-0.615,0.615-0.615,1.613,0,2.228l1.733,1.732L50.787,15.555z"/>
					<path className="fandom_achttien" d="M50.787,15.555c0.619,0.554,1.566,0.539,2.16-0.055l2.228-2.228l5.013,5.013
						c0.615,0.615,0.615,1.613,0,2.228l-3.342,3.342c-0.615,0.615-1.613,0.615-2.228,0l-3.342-3.342L35.68,36.108
						c-0.615,0.615-1.613,0.615-2.228,0l-1.609-1.609L50.787,15.555z M32.509,45.613L7.959,34.888c0.018-0.047,0.025-0.095,0.038-0.143
						c-0.239,0.831-1.089,1.498-2.139,1.039L2.97,34.523l-2.838,6.496c-0.348,0.797,0.016,1.726,0.813,2.074l4.331,1.892
						c0.797,0.348,1.726-0.016,2.074-0.813l1.892-4.331l20.211,8.829c0.797,0.348,1.726-0.016,2.074-0.813L32.509,45.613z"/>
					<path className="fandom_zeventien" d="M37.596,23.053l2-2l11.14,0l-2,2L37.596,23.053z M44.139,27.649l2-2l-11.14,0l-2,2
						L44.139,27.649z M41.543,30.245l-11.14,0l-0.293,0.293c-0.461,0.461-0.577,1.138-0.346,1.707l9.779,0L41.543,30.245z
						 M15.688,34.062l-2.592-1.132l4.065,10.372l2.592,1.132L15.688,34.062z M21.644,36.664l-2.592-1.132l4.065,10.372l2.592,1.132
						L21.644,36.664z M25.009,38.134l4.065,10.372l0.379,0.166c0.598,0.261,1.27,0.122,1.716-0.301l-3.568-9.104L25.009,38.134z"/>
				</g>
			</g>
			</svg>
		</div>
    );
}

export default CreateParty;