<?php
// Define variables for email
$recipient_email = "info@cameramonit.com";
$subject = "New Contact Form Submission";

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $company = isset($_POST['company']) ? strip_tags(trim($_POST['company'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $interest = isset($_POST['interest']) ? strip_tags(trim($_POST['interest'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    // Check if required fields are empty
    if (empty($name) || empty($email) || empty($message)) {
        $response = [
            'success' => false,
            'message' => 'Please fill all required fields.'
        ];

        echo json_encode($response);
        exit;
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = [
            'success' => false,
            'message' => 'Please enter a valid email address.'
        ];

        echo json_encode($response);
        exit;
    }

    // Prepare email content
    $email_content = "Name: $name\n";
    $email_content .= "Company: $company\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Interest: $interest\n\n";
    $email_content .= "Message:\n$message\n";

    // Set email headers
    $headers = "From: $name <$email>";

    // Send the email
    if (mail($recipient_email, $subject, $email_content, $headers)) {
        // Store the data in a CSV file for backup
        $data = [
            date('Y-m-d H:i:s'),
            $name,
            $company,
            $email,
            $phone,
            $interest,
            $message
        ];

        $file = fopen('contact_submissions.csv', 'a');
        fputcsv($file, $data);
        fclose($file);

        $response = [
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.'
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'Oops! Something went wrong. Please try again later.'
        ];
    }

    echo json_encode($response);
} else {
    // Not a POST request, redirect to home page
    header("Location: index.html");
    exit;
}
?>