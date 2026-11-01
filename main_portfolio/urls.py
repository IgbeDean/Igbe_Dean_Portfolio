from django.urls import path
from . import views

urlpatterns = [
    # Route for your single-page view layout
    path('', views.home_view, name='home'),
    
    # Route that processes the form submission logic
    path('contact-submit/', views.contact_view, name='contact'),
]