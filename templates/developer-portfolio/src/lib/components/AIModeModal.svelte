<script lang="ts">
	import { X, Send, Sparkles, Loader2 } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';

	export let profileName: string;
	export let onClose: () => void;

	interface Message {
		role: 'user' | 'model';
		text: string;
	}

	let input = '';
	let messages: Message[] = [
		{ role: 'model', text: `Hi! I'm an AI assistant for ${profileName}. Ask me anything about their projects, skills, or experience.` }
	];
	let isLoading = false;
	let messagesEndRef: HTMLDivElement;

	async function scrollToBottom() {
		await tick();
		messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
	}

	$: if (messages) {
		scrollToBottom();
	}

	async function handleSend() {
		if (!input.trim() || isLoading) return;

		const userMsg = input.trim();
		input = '';
		messages = [...messages, { role: 'user', text: userMsg }];
		isLoading = true;

		// Prepare history for API
		const history = messages.map(m => ({
			role: m.role,
			parts: [{ text: m.text }]
		}));

		// TODO: Implement chatWithPortfolio service
		// const responseText = await chatWithPortfolio(userMsg, history);
		const responseText = "AI response placeholder - implement chatWithPortfolio service";

		messages = [...messages, { role: 'model', text: responseText }];
		isLoading = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSend();
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
	<div class="bg-canvas-overlay border border-border-default w-full max-w-lg rounded-lg shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">

		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-border-default bg-canvas-subtle rounded-t-lg">
			<div class="flex items-center gap-2 text-fg-default">
				<Sparkles class="text-purple-400" size={18} />
				<span class="font-semibold">Ask {profileName}'s Assistant</span>
			</div>
			<button on:click={onClose} class="text-fg-muted hover:text-fg-default">
				<X size={20} />
			</button>
		</div>

		<!-- Chat Area -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4">
			{#each messages as msg, idx}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed {msg.role === 'user'
							? 'bg-accent-emphasis text-white'
							: 'bg-canvas-subtle border border-border-default text-fg-default'}"
					>
						{msg.text}
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="flex justify-start">
					<div class="bg-canvas-subtle border border-border-default rounded-lg px-3 py-2 flex items-center gap-2 text-fg-muted text-sm">
						<Loader2 size={14} class="animate-spin" />
						<span>Thinking...</span>
					</div>
				</div>
			{/if}
			<div bind:this={messagesEndRef}></div>
		</div>

		<!-- Input Area -->
		<div class="p-4 border-t border-border-default bg-canvas-subtle rounded-b-lg">
			<div class="relative">
				<input
					type="text"
					bind:value={input}
					on:keydown={handleKeyDown}
					placeholder="Ask about projects, skills..."
					class="w-full bg-canvas-default border border-border-default rounded-md pl-3 pr-10 py-2 text-sm text-fg-default focus:ring-1 focus:ring-accent-fg outline-none"
				/>
				<button
					on:click={handleSend}
					disabled={isLoading || !input.trim()}
					class="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-accent-fg disabled:opacity-50"
				>
					<Send size={16} />
				</button>
			</div>
			<div class="mt-2 text-[10px] text-fg-muted text-center">
				AI generated responses may be inaccurate. Powered by Gemini.
			</div>
		</div>
	</div>
</div>
