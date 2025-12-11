<script lang="ts">
    interface PlanFeature {
        text: string;
        limit?: string;
        tooltip?: string;
    }

    interface PlanPrice {
        monthly: number;
        yearly: number;
    }

    interface Plan {
        id?: string;
        name: string;
        info: string;
        price: PlanPrice;
        features: PlanFeature[];
        btn: {
            text: string;
            href: string;
        };
        highlighted?: boolean;
    }

    interface Props {
        plans: Plan[];
        heading?: string;
        description?: string;
        monthlyLabel?: string;
        yearlyLabel?: string;
        savingsText?: string;
        popularBadgeText?: string;
        billedAnnuallyText?: string;
        saveVsMonthlyText?: string;
    }

    let { 
        plans, 
        heading = '', 
        description = '',
        monthlyLabel = 'Monthly',
        yearlyLabel = 'Yearly',
        savingsText = 'Save up to 12%',
        popularBadgeText = 'Most Popular',
        billedAnnuallyText = 'Billed annually',
        saveVsMonthlyText = 'Save'
    }: Props = $props();

    let isYearly = $state(false);
    let openTooltip = $state<string | null>(null);

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    }

    function getPrice(plan: Plan): string {
        return formatPrice(isYearly ? plan.price.yearly : plan.price.monthly);
    }

    function getBillingPeriod(): string {
        return isYearly ? '/year' : '/month';
    }

    function calculateSavings(plan: Plan): number {
        const monthlyTotal = plan.price.monthly * 12;
        const yearlyPrice = plan.price.yearly;
        return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
    }

    function toggleTooltip(featureId: string) {
        openTooltip = openTooltip === featureId ? null : featureId;
    }

    function cn(...classes: (string | boolean | undefined)[]) {
        return classes.filter(Boolean).join(' ');
    }
</script>

<section class="pricing-section">
    <!-- Header -->
    {#if heading || description}
        <div class="pricing-header">
            {#if heading}
                <h2 class="pricing-heading">{heading}</h2>
            {/if}
            {#if description}
                <p class="pricing-description">{description}</p>
            {/if}
        </div>
    {/if}

    <!-- Billing Toggle -->
    <div class="billing-toggle-wrapper">
        <button
            type="button"
            class="billing-button"
            class:active={!isYearly}
            onclick={() => isYearly = false}
        >
            {monthlyLabel}
        </button>
        <button
            type="button"
            class="billing-button"
            class:active={isYearly}
            onclick={() => isYearly = true}
        >
            {yearlyLabel}
        </button>
        {#if isYearly && savingsText}
            <span class="savings-badge">{savingsText}</span>
        {/if}
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-grid" style="grid-template-columns: repeat({plans.length}, 1fr);">
        {#each plans as plan, index (plan.id || plan.name)}
            <div class={cn('pricing-card', plan.highlighted && 'highlighted')}>
                {#if plan.highlighted && popularBadgeText}
                    <div class="popular-badge">
                        <span>{popularBadgeText}</span>
                    </div>
                {/if}

                <div class="card-header">
                    <h3 class="card-title">{plan.name}</h3>
                    <p class="card-description">{plan.info}</p>
                </div>

                <div class="card-content">
                    <!-- Price -->
                    <div class="price-section">
                        <div class="price-display">
                            <span class="price-amount">{getPrice(plan)}</span>
                            <span class="price-period">{getBillingPeriod()}</span>
                        </div>
                        {#if isYearly}
                            <p class="billing-details">
                                {billedAnnuallyText} ({formatPrice(plan.price.yearly)}/year)
                            </p>
                            {#if calculateSavings(plan) > 0}
                                <p class="savings-text">
                                    {saveVsMonthlyText} {calculateSavings(plan)}% vs monthly
                                </p>
                            {/if}
                        {/if}
                    </div>

                    <!-- Features -->
                    <ul class="features-list">
                        {#each plan.features as feature, featureIndex}
                            {@const featureId = `${plan.id || index}-feature-${featureIndex}`}
                            <li class="feature-item">
                                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <div class="feature-content">
                                    <span class="feature-text">
                                        {feature.text}
                                        {#if feature.limit}
                                            <span class="feature-limit">({feature.limit})</span>
                                        {/if}
                                    </span>
                                    {#if feature.tooltip}
                                        <div class="tooltip-wrapper">
                                            <button
                                                type="button"
                                                class="tooltip-trigger"
                                                onclick={() => toggleTooltip(featureId)}
                                                aria-label="More information"
                                            >
                                                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                </svg>
                                            </button>
                                            {#if openTooltip === featureId}
                                                <div class="tooltip-content">
                                                    {feature.tooltip}
                                                </div>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="card-footer">
                    <a 
                        href={plan.btn.href}
                        class={cn('plan-button', plan.highlighted ? 'primary' : 'outline')}
                    >
                        {plan.btn.text}
                    </a>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .pricing-section {
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .pricing-header {
        text-align: center;
        margin-bottom: 3rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .pricing-heading {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: #f1f5f9;
    }

    .pricing-description {
        font-size: 1.125rem;
        max-width: 42rem;
        margin: 0 auto;
        color: #cbd5e1;
    }

    .billing-toggle-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 2rem;
        margin-bottom: 3rem;
    }

    .billing-button {
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border: 1px solid #475569;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
        background: transparent;
        color: #94a3b8;
    }

    .billing-button:hover {
        background: #1e293b;
        border-color: #60a5fa;
        color: #e2e8f0;
    }

    .billing-button.active {
        font-weight: 600;
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
    }

    .savings-badge {
        font-size: 0.875rem;
        font-weight: 500;
        margin-left: 0.5rem;
        background: #10b981;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
    }

    .pricing-grid {
        display: grid;
        gap: 1.5rem;
    }

    @media (max-width: 767px) {
        .pricing-grid {
            grid-template-columns: 1fr !important;
        }
    }

    @media (min-width: 768px) {
        .pricing-heading {
            font-size: 2.5rem;
        }

        .pricing-grid {
            gap: 2rem;
        }
    }

    .pricing-card {
        position: relative;
        display: flex;
        flex-direction: column;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 0.5rem;
        padding: 1.5rem;
        transition: all 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .pricing-card:hover {
        border-color: #475569;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
    }

    .pricing-card.highlighted {
        background: #1e293b;
        border: 2px solid #3b82f6;
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        transform: scale(1.02);
    }

    @media (min-width: 1024px) {
        .pricing-card.highlighted {
            transform: scale(1.05);
        }
    }

    .popular-badge {
        position: absolute;
        top: -1rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .popular-badge span {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: #3b82f6;
        color: white;
    }

    .card-header {
        margin-bottom: 1.5rem;
    }

    .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #f1f5f9;
    }

    .card-description {
        font-size: 0.875rem;
        color: #94a3b8;
    }

    .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .price-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .price-display {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
    }

    .price-amount {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.02em;
        color: #f1f5f9;
    }

    .price-period {
        font-size: 0.875rem;
        color: #94a3b8;
    }

    .billing-details {
        font-size: 0.875rem;
        margin: 0;
        color: #64748b;
    }

    .savings-text {
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        color: #10b981;
    }

    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .check-icon {
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
        margin-top: 0.125rem;
        color: #10b981;
    }

    .feature-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .feature-text {
        font-size: 0.875rem;
        color: #cbd5e1;
    }

    .feature-limit {
        color: #94a3b8;
    }

    .tooltip-wrapper {
        position: relative;
    }

    .tooltip-trigger {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: all 0.2s;
        color: #64748b;
    }

    .tooltip-trigger:hover {
        color: #94a3b8;
    }

    .info-icon {
        width: 1rem;
        height: 1rem;
    }

    .tooltip-content {
        position: absolute;
        bottom: calc(100% + 0.5rem);
        left: 50%;
        transform: translateX(-50%);
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        max-width: 16rem;
        white-space: normal;
        z-index: 50;
        background: #0f172a;
        color: #e2e8f0;
        border: 1px solid #334155;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .card-footer {
        margin-top: 1.5rem;
    }

    .plan-button {
        display: block;
        width: 100%;
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
        text-decoration: none;
        border-radius: 0.375rem;
        transition: all 0.2s;
        cursor: pointer;
    }

    .plan-button.primary {
        background: #3b82f6;
        color: white;
        border: 1px solid #3b82f6;
    }

    .plan-button.primary:hover {
        background: #2563eb;
        border-color: #2563eb;
    }

    .plan-button.outline {
        background: transparent;
        color: #e2e8f0;
        border: 1px solid #475569;
    }

    .plan-button.outline:hover {
        background: #334155;
        border-color: #60a5fa;
        color: #f1f5f9;
    }
</style>
