import * as React from "react"
import * as ReactDOM from "react-dom"

class Hello extends React.Component {

	state = {
		blockingEnabled: false,
		blocklistInput: '',
		blocklist: [],
	}

	componentDidMount() {
		chrome.storage.sync.get(['yemeksepetiFoodBlockerState'], (items) => {
			this.setState(items['yemeksepetiFoodBlockerState']);
			this.setupAnchorLinks();
		});
	}

	handleCheckboxChange = (e) => {
		this.setState({ blockingEnabled: e.target.checked }, this.persistStateToLocalStorage);
	}

	persistStateToLocalStorage = () => {
		chrome.storage.sync.remove('yemeksepetiFoodBlockerState', () => {
			chrome.storage.sync.set({ 'yemeksepetiFoodBlockerState': this.state });
		});
	}

	handleBlocklistChange = (e) => {
		this.setState({ blocklistInput: e.target.value }, this.persistStateToLocalStorage);
	}

	handleAddToBlocklist = () => {
		const { blocklistInput, blocklist } = this.state;

		if (blocklistInput) {
			this.setState({
				blocklist: [...blocklist, blocklistInput]
			}, () => {
				this.persistStateToLocalStorage();
				const input: HTMLInputElement = document.querySelector('.blocklist-input');
				if (input) input.value = '';
			});
		}
	}

	removeFromBlocklist = (item) => {
		const { blocklist } = this.state;

		this.setState({
			blocklist: blocklist.filter(x => x !== item),
		}, this.persistStateToLocalStorage);
	}

	setupAnchorLinks() {
    const links = document.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
			(function () {
				const ln = links[i];
				const location = ln.href;
				ln.onclick = function () {
					chrome.tabs.create({ active: true, url: location });
				};
			})();
    }
	}

	render() {
		const { blocklist } = this.state;

		return (
			<div className="container">
				<h1 className="main-title">Yemeksepeti Food Blocker</h1>
				<p className="main-description">Block foods and restaurants on Yemeksepeti.com</p>

				<div className="options-container">
						<div className="option-input">
							<label htmlFor="enableBlockingCheckbox">Enable blocking</label>
							<label className="checkbox">
									<input onChange={this.handleCheckboxChange} id="enableBlockingCheckbox" checked={this.state.blockingEnabled} className="checkbox__input" type="checkbox"/>
									<svg className="checkbox__check" width="24" height="24">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
							</label>
						</div>
						<div className="option-input">
							<div>
								<input onChange={this.handleBlocklistChange} className="input input-primary blocklist-input" type="text" placeholder="Type in..."/>
								<br/><br/>
								<button onClick={this.handleAddToBlocklist} className="button button-primary" >Add to blocklist</button>
							</div>
						</div>
						<div className="blocklist-container">
							{ blocklist && blocklist.length && (
								<h4>Blocked food list:</h4>
							)}
							{ blocklist && blocklist.length ? (
								blocklist.map((item, i) =>
									<div className="blocklist-item" key={i}>
										<span className="blocklist-item-name">- { item }</span>
										<span className="blocklist-item-remove" onClick={() => this.removeFromBlocklist(item)}>x</span>
									</div>
								)
							) : (
								<p className="main-description">Add food to enable blocking. Example: <span style={{color: 'grey'}}>çiğ köfte, cig-kofte</span></p>
							)}
						</div>
				</div>
				<div className="footer-links">
					<a href="https://github.com/ahmetomerv/yemeksepeti-food-blocker">GitHub</a>
					<a href="https://twitter.com/eswordert">Twitter</a>
				</div>
			</div>
		)
	}
}

ReactDOM.render(
	<Hello />,
	document.getElementById('root')
)
