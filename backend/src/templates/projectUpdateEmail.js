const { buildEmailLayout } = require('./_shared');

const buildProjectUpdateEmail = ({ brand, project, client, updateType = 'status', message }) => {
    const content = buildEmailLayout({
        brand,
        preheader: 'Project update',
        title: 'Project Update',
        headline: `Project update: ${project.title}`,
        intro: message || `There is a new update on your project "${project.title}".`,
        details: [
            { label: 'Project', value: project.title },
            { label: 'Status', value: project.status },
            { label: 'Progress', value: `${project.progress}%` },
            { label: 'Client', value: client?.name || project.client?.name || 'Client' },
            { label: 'Update type', value: updateType },
        ],
        ctaText: 'View project',
        ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/projects/${project._id}`,
        footerNote: 'Login to your dashboard to review the latest files, milestones, and notes.',
    });

    return {
        subject: `Project update - ${project.title}`,
        ...content,
    };
};

module.exports = { buildProjectUpdateEmail };