import { FileView, TFile, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { StrictMode } from "react";

import { App } from "@/components/ChatPanel";

import type ChatRecordPlugin from "@/main";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ChatView extends FileView {
	root: Root;
	plugin: ChatRecordPlugin;

	private cache = new Map<string, any>();
	private readonly MAX_CACHE_SIZE = 50;

	constructor(leaf: WorkspaceLeaf, plugin: ChatRecordPlugin) {
		super(leaf);
		this.plugin = plugin;
		console.log('ChatView constructor’');
	}

	async onLoadFile(file: TFile) {
		console.log("onLoadFile", file);

		// 检查缓存
		if (this.cache.has(file.path)) {
			const cachedData = this.cache.get(file.path);
			this.root.render(
				<StrictMode>
					<App messages={cachedData.message} />
				</StrictMode>
			);
			return;
		}
		const dbFile = await this.app.vault.adapter.read(file.path);
		try {
			const data = JSON.parse(dbFile);

			// 更新缓存（先删除再添加以实现LRU）
			this.cache.delete(file.path);
			this.cache.set(file.path, data);

			// 保持缓存大小不超过限制
			if (this.cache.size > this.MAX_CACHE_SIZE) {
				const oldestKey = this.cache.keys().next().value;
				this.cache.delete(oldestKey);
			}

			this.root.render(
				<StrictMode>
					<App messages={data.message} />
				</StrictMode>
			);
		} catch (e) {
			console.log("open file error", e);
			return;
		}
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		console.log('getDisplayText');
		return "和XX的聊天记录 - 2023-04-13";
	}

	async onOpen() {
		console.log("onOpen");
		const container = this.containerEl.children[1];
		container.empty();
		this.root = createRoot(container);
	}
	onRename(file: TFile) {
		console.log("onRename", file);
		return Promise.resolve();
	}


	async onClose() {
		this.root.unmount();
	}
}
