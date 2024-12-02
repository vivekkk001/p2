<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', 'registration_errors.log');

// Prevent direct access to the file
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    die('Access Denied');
}

// Function to log errors
function logError($message) {
    error_log($message);
}

// Sanitize and validate input data
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

// Debug: Log all received POST data
logError('Received POST data: ' . print_r($_POST, true));

// Collect and sanitize form data
$fullName = sanitizeInput($_POST['fullName'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$dob = sanitizeInput($_POST['dob'] ?? '');
$gender = sanitizeInput($_POST['gender'] ?? '');
$address = sanitizeInput($_POST['address'] ?? '');
$education = sanitizeInput($_POST['education'] ?? '');
$skills = sanitizeInput($_POST['skills'] ?? '');

// Validate full name
function validateFullName($name) {
    return preg_match('/^[a-zA-Z\s]{2,}$/', $name);
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate phone number
function validatePhone($phone) {
    return preg_match('/^[0-9]{10}$/', $phone);
}

// Validate date of birth
function validateDOB($dob) {
    try {
        $birthDate = new DateTime($dob);
        $today = new DateTime();
        $age = $today->diff($birthDate)->y;
        return $age >= 16;
    } catch (Exception $e) {
        logError('DOB Validation Error: ' . $e->getMessage());
        return false;
    }
}

// Validation checks
$errors = [];

if (empty($fullName) || !validateFullName($fullName)) {
    $errors[] = "Invalid full name. Use only letters and spaces, minimum 2 characters.";
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = "Invalid email address.";
}

if (empty($phone) || !validatePhone($phone)) {
    $errors[] = "Invalid phone number. Must be 10 digits.";
}

if (empty($dob) || !validateDOB($dob)) {
    $errors[] = "You must be at least 16 years old.";
}

// Debug: Log validation errors
if (!empty($errors)) {
    logError('Validation Errors: ' . print_r($errors, true));
    http_response_code(400);
    echo "Validation Errors:<br>" . implode("<br>", $errors);
    exit;
}

// In case no errors, proceed with display
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registration Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .registration-details {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .registration-details h2 {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .registration-details p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="registration-details">
        <h2>Registration Details</h2>
        <p><strong>Full Name:</strong> <?php echo $fullName; ?></p>
        <p><strong>Email:</strong> <?php echo $email; ?></p>
        <p><strong>Phone:</strong> <?php echo $phone; ?></p>
        <p><strong>Date of Birth:</strong> <?php echo $dob; ?></p>
        <p><strong>Gender:</strong> <?php echo $gender; ?></p>
        <p><strong>Address:</strong> <?php echo $address; ?></p>
        <p><strong>Education:</strong> <?php echo $education; ?></p>
        <p><strong>Skills:</strong> <?php echo $skills; ?></p>
    </div>
</body>
</html>
<?php
// Debug: Log successful submission
logError('Registration Successful for: ' . $fullName);
?>