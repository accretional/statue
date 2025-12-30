export interface ThemeDefinition {
	id: string;
	name: string;
	colors: {
		background: string;
		card: string;
		border: string;
		foreground: string;
		muted: string;
		primary: string;
		secondary: string;
		accent: string;
		'on-primary': string;
		'on-background': string;
		'hero-from': string;
		'hero-via': string;
		'hero-to': string;
	};
}

export const themes: ThemeDefinition[] = [
	{
		id: 'black-white',
		name: 'Black & White',
		colors: {
			background: '#000000',
			card: '#1a1a1a',
			border: '#333333',
			foreground: '#ffffff',
			muted: '#999999',
			primary: '#ffffff',
			secondary: '#cccccc',
			accent: '#666666',
			'on-primary': '#000000',
			'on-background': '#ffffff',
			'hero-from': '#000000',
			'hero-via': '#1a1a1a',
			'hero-to': '#000000'
		}
	},
	{
		id: 'blue',
		name: 'Blue',
		colors: {
			background: '#0b1220',
			card: '#0f172a',
			border: '#1e3a5f',
			foreground: '#e5e7eb',
			muted: '#94a3b8',
			primary: '#3b82f6',
			secondary: '#60a5fa',
			accent: '#2563eb',
			'on-primary': '#ffffff',
			'on-background': '#0f172a',
			'hero-from': '#0b1220',
			'hero-via': '#0f172a',
			'hero-to': '#0b1220'
		}
	},
	{
		id: 'red',
		name: 'Red',
		colors: {
			background: '#1a0b0e',
			card: '#2d1417',
			border: '#5f1e2a',
			foreground: '#fce7f3',
			muted: '#fda4af',
			primary: '#ef4444',
			secondary: '#f87171',
			accent: '#dc2626',
			'on-primary': '#ffffff',
			'on-background': '#2d1417',
			'hero-from': '#1a0b0e',
			'hero-via': '#2d1417',
			'hero-to': '#1a0b0e'
		}
	},
	{
		id: 'green',
		name: 'Green',
		colors: {
			background: '#0b1a14',
			card: '#0f2a1f',
			border: '#1e5f3a',
			foreground: '#e7fcf3',
			muted: '#86efac',
			primary: '#10b981',
			secondary: '#34d399',
			accent: '#059669',
			'on-primary': '#ffffff',
			'on-background': '#0f2a1f',
			'hero-from': '#0b1a14',
			'hero-via': '#0f2a1f',
			'hero-to': '#0b1a14'
		}
	},
	{
		id: 'orange',
		name: 'Orange',
		colors: {
			background: '#1a120b',
			card: '#2a1f0f',
			border: '#5f3a1e',
			foreground: '#fef3e7',
			muted: '#fdba74',
			primary: '#f97316',
			secondary: '#fb923c',
			accent: '#ea580c',
			'on-primary': '#ffffff',
			'on-background': '#2a1f0f',
			'hero-from': '#1a120b',
			'hero-via': '#2a1f0f',
			'hero-to': '#1a120b'
		}
	},
	{
		id: 'purple',
		name: 'Purple',
		colors: {
			background: '#150b1a',
			card: '#1f0f2a',
			border: '#3a1e5f',
			foreground: '#f3e7fc',
			muted: '#d8b4fe',
			primary: '#a855f7',
			secondary: '#c084fc',
			accent: '#9333ea',
			'on-primary': '#ffffff',
			'on-background': '#1f0f2a',
			'hero-from': '#150b1a',
			'hero-via': '#1f0f2a',
			'hero-to': '#150b1a'
		}
	},
	{
		id: 'cyan',
		name: 'Cyan',
		colors: {
			background: '#0b1a1a',
			card: '#0f2a2a',
			border: '#1e5f5f',
			foreground: '#e7fcfc',
			muted: '#67e8f9',
			primary: '#06b6d4',
			secondary: '#22d3ee',
			accent: '#0891b2',
			'on-primary': '#ffffff',
			'on-background': '#0f2a2a',
			'hero-from': '#0b1a1a',
			'hero-via': '#0f2a2a',
			'hero-to': '#0b1a1a'
		}
	},
	{
		id: 'pink',
		name: 'Pink',
		colors: {
			background: '#1a0b15',
			card: '#2a0f1f',
			border: '#5f1e3a',
			foreground: '#fce7f3',
			muted: '#f9a8d4',
			primary: '#ec4899',
			secondary: '#f472b6',
			accent: '#db2777',
			'on-primary': '#ffffff',
			'on-background': '#2a0f1f',
			'hero-from': '#1a0b15',
			'hero-via': '#2a0f1f',
			'hero-to': '#1a0b15'
		}
	},
	{
		id: 'black-red',
		name: 'Black & Red',
		colors: {
			background: '#000000',
			card: '#1a0000',
			border: '#330000',
			foreground: '#ffffff',
			muted: '#999999',
			primary: '#dc2626',
			secondary: '#ef4444',
			accent: '#b91c1c',
			'on-primary': '#ffffff',
			'on-background': '#ffffff',
			'hero-from': '#000000',
			'hero-via': '#1a0000',
			'hero-to': '#000000'
		}
	},
	{
		id: 'charcoal',
		name: 'Charcoal',
		colors: {
			background: '#212121',
			card: '#303030',
			border: '#444444',
			foreground: '#f5f5f5',
			muted: '#a0a0a0',
			primary: '#ffffff',
			secondary: '#e0e0e0',
			accent: '#888888',
			'on-primary': '#212121',
			'on-background': '#f5f5f5',
			'hero-from': '#212121',
			'hero-via': '#2a2a2a',
			'hero-to': '#212121'
		}
	}
];

export const defaultTheme = 'black-white';
