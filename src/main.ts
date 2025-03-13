import { ChatView, VIEW_TYPE_EXAMPLE } from "@/views/ChatView";
import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";

import "@/styles.css";


interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class ChatRecordPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ChatView(leaf, this));
		this.registerExtensions(['chat'], VIEW_TYPE_EXAMPLE);

		const ribbonIconEl = this.addRibbonIcon("message-circle-heart", "Create new chat", () => {
			this.createNewChatFile()
		});
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	/**
	 * Creates a new chat file
	 */
	createNewChatFile() {
		const activeFile = this.app.workspace.getActiveFile();
		const path = (activeFile && activeFile.parent) ? activeFile.parent.path : '';
		this.app.vault.create(`${path}/Untitled.chat`, '')
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: ChatRecordPlugin;

	constructor(app: App, plugin: ChatRecordPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
