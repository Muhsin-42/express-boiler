import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
}

export interface EmailTemplateData {
  [key: string]: any;
}

export enum EmailTemplateType {
  PASSWORD_RESET = "password-reset",
  WELCOME = "welcome",
  ACCOUNT_VERIFICATION = "account-verification",
  CASE_CREATION = "case-creation",
}

class EmailTemplateManager {
  private templateCache: Map<EmailTemplateType, handlebars.TemplateDelegate> =
    new Map();
  private subjectCache: Map<EmailTemplateType, string> = new Map();
  private templateDir: string;
  private mainTemplate: handlebars.TemplateDelegate;

  constructor() {
    this.templateDir = path.join(__dirname, "../../templates/emails");

    // Load the main layout template
    const mainTemplatePath = path.join(this.templateDir, "layout.html");
    const mainTemplateSource = fs.readFileSync(mainTemplatePath, "utf-8");
    this.mainTemplate = handlebars.compile(mainTemplateSource);

    // Register any needed Handlebars helpers
    this.registerHelpers();
  }

  private registerHelpers() {
    handlebars.registerHelper("formatDate", (date: Date) => {
      return date.toLocaleDateString();
    });

    // Helper to check if a string starts with a specific substring
    handlebars.registerHelper(
      "startsWith",
      function (
        this: any,
        str: string,
        prefix: string,
        options: Handlebars.HelperOptions
      ) {
        if (typeof str === "string" && str.startsWith(prefix))
          return options.fn(this);

        return options.inverse(this);
      }
    );

    // Helper to get the last four characters of a string (for card numbers)
    handlebars.registerHelper("lastFour", (str: string) => {
      if (typeof str === "string" && str.length >= 4) return str.slice(-4);

      return "****";
    });
  }

  private loadTemplate(type: EmailTemplateType): void {
    const templatePath = path.join(this.templateDir, `${type}.html`);
    const configPath = path.join(this.templateDir, `${type}.json`);

    try {
      // Load the template content
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      this.templateCache.set(type, handlebars.compile(templateSource));

      // Load the template configuration (subject, etc.)
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configContent);
        this.subjectCache.set(type, config.subject);
      } else {
        this.subjectCache.set(type, ""); // Default empty subject
      }
    } catch (error) {
      console.error(`Failed to load email template: ${type}`, error);
      throw new Error(`Email template not found: ${type}`);
    }
  }

  public getTemplate(
    type: EmailTemplateType,
    data: EmailTemplateData
  ): EmailTemplate {
    // Load the template if not in cache
    if (!this.templateCache.has(type)) this.loadTemplate(type);

    const contentTemplate = this.templateCache.get(type)!;
    const subject = this.subjectCache.get(type)!;

    // Compile the content template with the provided data
    const contentHtml = contentTemplate(data);

    // Render the main layout with the content
    const htmlContent = this.mainTemplate({
      ...data,
      content: contentHtml,
    });

    return {
      subject: this.compileSubject(subject, data),
      htmlContent,
    };
  }

  private compileSubject(subject: string, data: EmailTemplateData): string {
    const subjectTemplate = handlebars.compile(subject);
    return subjectTemplate(data);
  }
}

// Export singleton instance
export const emailTemplates = new EmailTemplateManager();
