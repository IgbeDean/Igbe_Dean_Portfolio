from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from .forms import PortfolioContactForm

def home_view(request):
    """
    Renders the central portfolio interface and instantiates 
    the clean form schema for the contact card layer.
    """
    form = PortfolioContactForm()
    return render(request, 'index.html', {'form': form})



def contact_view(request):
    """
    Processes the contact form POST requests and dispatches 
    submissions straight to your business email inbox.
    """
    if request.method == 'POST':
        form = PortfolioContactForm(request.POST)
        
        if form.is_valid():
            # Safely extract sanitized inputs
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            user_message = form.cleaned_data['message']
            
            # 1. Clean Text Fallback (for email clients that don't render HTML)
            text_content = f"Portfolio Inquiry\n\nFrom: {name}\nEmail: {email}\n\nMessage:\n{user_message}"
            
            # 2. Rich HTML Layout Design
           # 2. Rich HTML Layout Design (Refined Light Theme)
            html_content = f"""
            <div style="background-color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 600px; border-radius: 12px; border: 1px solid #e1e3e6; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="margin-top: 0; color: #7c4dff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px; border-bottom: 2px solid #f4f5f7; padding-bottom: 16px;">
                    Inbound Portfolio Message
                </h2>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-size: 12px; color: #656973; text-transform: uppercase; letter-spacing: 0.5px; width: 90px; font-weight: 600;">Sender</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">{name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-size: 12px; color: #656973; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Email</td>
                        <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:{email}" style="color: #7c4dff; text-decoration: none; font-weight: 500;">{email}</a></td>
                    </tr>
                </table>
                <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid #f4f5f7;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #656973; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Message Body</p>
                    <p style="margin: 0; font-size: 14px; color: #2d3138; line-height: 1.6; white-space: pre-wrap;">{user_message}</p>
                </div>
            </div>
            """
            
            try:
                send_mail(
                    subject=f"Inquiry from {name}",
                    message=text_content,            # Required plain text fallback
                    from_email=None, 
                    recipient_list=['igbedean@gmail.com'],
                    html_message=html_content,       # The rich styled wrapper
                    fail_silently=False,
                )
                messages.success(request, "Your message has been sent successfully!")
            except Exception as e:
                # TEMPORARY LOGGING: Print the exact SMTP error to your terminal console
                print("================ SMTP ERROR LOG ================")
                print(e)
                print("================================================")
                messages.error(request, "Something went wrong sending your message. Please try again later.")
        else:
            messages.error(request, "Please correct the errors in the form below.")
            
    # Always redirect back to the home page to preserve single-page navigation flow
    return redirect('home')